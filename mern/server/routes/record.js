import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import logger from "../logger.js";
import { getTotalDestinationCost } from "./util.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
const collectionUsed = "freightRates";

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection(collectionUsed);
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// // This section will help you get a single record by id
// router.get("/:id", async (req, res) => {
//   let collection = await db.collection(collectionUsed);
//   let query = { _id: new ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

router.get("/shippingLine/:shippingLine", async (req, res) => {
  try {
    const collection = await db.collection(collectionUsed);
    logger.info('Inside Get ShippingLine route', req?.params);
    // Use aggregate to group and collect unique POD_NAME and DEL_NAME
    const result = await collection.aggregate([
      { 
        $match: { 
          "SHIPPING_LINE": String(req.params?.shippingLine) 
        } 
      },
      {
        $group: {
          _id: { POD_NAME: "$POD_NAME", DEL_NAME: "$DEL_NAME" }, // Group by both POD_NAME and DEL_NAME
        }
      },
      {
        $group: {
          _id: null, // Group by null to aggregate all documents
          mappings: {
            $push: { // Create an array of objects for mappings
              POD_NAME: "$_id.POD_NAME",
              DEL_NAME: "$_id.DEL_NAME",
            }
          }
        }
      }
    ]).toArray();
    logger.info('result:', result)
//|| !result[0].uniquePOD_NAMES || !result[0].uniqueDEL_NAMES
    if (result.length === 0 ) {
      res.status(404).send("No unique names found");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/freightRates", async (req, res) => {
  try {
    logger.info('Inside Get FreightRates route', req?.query);
    const collection = await db.collection(collectionUsed);
    // Use aggregate to group and collect unique POD_NAME and DEL_NAME
    const result = await collection.aggregate([
      {
        $match: {
          "POD_NAME": req.query.podName, // Use query parameters from the request
          "DEL_NAME": req.query.delName
        }
      },
      {
        $project: { // Use the $project stage to specify which fields to include in the output
          _id: 0, // Exclude the _id field
          PER: 1,
          CARGO_TYPE: 1,
          INCO_TERMS: 1,
          OCEAN_FREIGHT: 1,
          POD_NAME: 1,
          DEL_NAME: 1,
        }
      }
    ]).toArray();

    if (result.length === 0) {
      res.status(404).send("No unique names found");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/freightRates/calculation", async (req, res) => {
  try {
    logger.info('Inside Get FreightRates calculation route', req?.query);
    const collection = await db.collection(collectionUsed);
    // Use aggregate to group and collect unique POD_NAME and DEL_NAME
    const result = await collection.aggregate([
      {
        $match: {
          ...((req.query.podName) && { "POD_NAME": req.query.podName }),
          ...((req.query.delName) && { "DEL_NAME": req.query.delName }),
          ...((req.query.shippingLine) && { "SHIPPING_LINE": req.query.shippingLine }),
          ...((req.query.per) && { "PER": req.query.per }),
          ...((req.query.cargoType) && { "CARGO_TYPE": req.query.cargoType }),
          ...((req.query.weightRange) && {
            "CARGO_WEIGHT_MIN_MT": { $lte: parseFloat(req.query.weightRange) },
            "CARGO_WEIGHT_MAX_MT": { $gte: parseFloat(req.query.weightRange) }
          }),
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          DESTINATION_COST: 1,
        }
      }
    ]).toArray();
    logger.info('result', result);

    if (result.length === 0) {
      res.status(404).send("No unique names found");
    } else {
      const DESTINATION_COST=getTotalDestinationCost(result[0]?.DESTINATION_COST);
      const OCEAN_FREIGHT=req.query.oceanFreightExPrice * req.query.oceanFreightExRate;
      const GST_5 = OCEAN_FREIGHT * 0.05;
      const GST_18 = (DESTINATION_COST + ((req.query?.incoPriceRate ?? 0) * (req.query.incoExchangeRate ?? 1))) * 0.18;
      const TOTAL_COST_WITH_GST = DESTINATION_COST + OCEAN_FREIGHT + GST_5 + GST_18;
      const TOTAL_COST={DESTINATION_COST,OCEAN_FREIGHT,GST_5,GST_18,TOTAL_COST_WITH_GST, IHC : result[0]?.DESTINATION_COST?.IHC,LOCAL_AND_DO: result[0]?.DESTINATION_COST?.LOCAL_AND_DO , THC: result[0]?.DESTINATION_COST?.THC, CIS: result[0]?.DESTINATION_COST?.CI};
      res.status(200).send(TOTAL_COST);
    }
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/insert", async (req, res) => {
  try {
    // Construct new document from the form values
    let newDocument = {
      POD_NAME: req.body.POD_NAME,
      DEL_NAME: req.body.DEL_NAME,
      EFFECTIVE_DATE: req.body.EFFECTIVE_DATE, // Assuming it's a valid ISO date string
      PER: req.body.PER,
      CARGO_TYPE: req.body.CARGO_TYPE,
      CARGO_WEIGHT_MIN_MT: req.body.CARGO_WEIGHT_MIN_MT,
      CARGO_WEIGHT_MAX_MT: req.body.CARGO_WEIGHT_MAX_MT,
      INCO_TERMS: req.body.INCO_TERMS, // Expecting this as an array or object based on how it's sent
      DESTINATION_COST: {
        THC: req.body.DESTINATION_COST_THC,
        IHC: req.body.DESTINATION_COST_IHC,
        LOCAL_AND_DO: req.body.DESTINATION_COST_LOCAL_AND_DO,
        CIS: req.body.DESTINATION_COST_CIS
      },
      SHIPPING_LINE: req.body.SHIPPING_LINE,
      ORG_ID: 1111,
    };

    // Connect to the database and the specific collection
    let collection = await db.collection(collectionUsed);

    // Insert the new document
    let result = await collection.insertOne(newDocument);

    // Send back the result with a successful status code
    res.status(201).send(result);  // 201 status code for Created
  } catch (err) {
    console.log(err);
    logger.error('ROUTE INPUT',err);
    res.status(500).send("Error adding record");
  }
});

router.put("/update", async (req, res) => {
  try {
    // Define the match criteria based on the request body
    const matchCriteria = {
      PER: req.body.per,
      CARGO_TYPE: req.body.cargoType,
      "CARGO_WEIGHT_MIN_MT": { $lte: parseInt(req.body.weightRange) },
      "CARGO_WEIGHT_MAX_MT": { $gte: parseInt(req.body.weightRange) },
      POD_NAME: req.body.pod_name,
      DEL_NAME: req.body.del_name,
      SHIPPING_LINE: req.body.shipping_line
    };

    // Prepare the updateDetails with conditional $set
    let updateDetails = { $set: {} };
    const fieldsToUpdate = {
      "DESTINATION_COST.THC": req.body.DESTINATION_COST_THC,
      "DESTINATION_COST.IHC": req.body.DESTINATION_COST_IHC,
      "DESTINATION_COST.LOCAL_AND_DO": req.body.DESTINATION_COST_LOCAL_AND_DO,
      "DESTINATION_COST.CIS": req.body.DESTINATION_COST_CIS
    };

    // Only add fields that have a truthy value
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value) { // Check for truthy value
        updateDetails.$set[key] = value;
      }
    }

    // Ensure there are updates to make
    if (Object.keys(updateDetails.$set).length === 0) {
      res.status(400).send("No valid updates provided");
      return;
    }

    // Connect to the database and the specific collection
    let collection = await db.collection(collectionUsed);

    // Perform the update operation
    const result = await collection.updateOne(matchCriteria, updateDetails);

    // Send back the result with a successful status code
    if (result.matchedCount === 0) {
      res.status(404).send("No matching records found.");
    } else if (result.modifiedCount === 0) {
      res.status(200).send("No updates made to the matching records.");
    } else {
      res.status(200).send("Record updated successfully.");
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection(collectionUsed);
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection(collectionUsed);
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection(collectionUsed);
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
