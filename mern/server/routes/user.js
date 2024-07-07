import express from "express";
// This help convert the id from string to ObjectId for the _id.
import logger from "../logger.js";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.post("/login", async (req, res) => {
    logger.info("Inside login Flow login", req.body, req.params, req.query);
    try {
        if (req.body) {
            const { username, password } = req.body || {};
            if (process.env.ADMIN_USER === username && process.env.ADMIN_PASSWORD === password) {
                res.send({ message: "User found" }).status(200);
            } else {
                res.status(404).send({ message: "Incorrect Credentials!" });
            }
        }
    } catch (e) {
        logger.error('error in logIn flow',e);
        res.status(401).send({ message: "Incorrect Credentials!" });
    }
});

export default router;