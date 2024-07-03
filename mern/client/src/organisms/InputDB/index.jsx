import React from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Card } from 'antd';
const { Option } = Select;
const InputFields = () => {
  const onFinish = async (values) => {
    response = await fetch("http://cargo-munshi-server.vercel.app/record/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    console.log('Received values of form: INPUT DB ', values);
  };

  return (
    <Card title="Insert new Entry" className='global-card card-common ' desc="Please make sure that the Values are consistent across DB">
    <Form onFinish={onFinish} layout="vertical" className='global-form-flex'>
      <Form.Item name="POD_NAME" label="POD Name">
        <Input placeholder='Please Enter POD NAME'/>
      </Form.Item>
      <Form.Item name="DEL_NAME" label="DEL Name">
        <Input placeholder='Please Enter DEL NAME'/>
      </Form.Item>
      <Form.Item name="EFFECTIVE_DATE" label="Effective Date">
        <DatePicker />
      </Form.Item>
      <Form.Item name="PER" label="PER">
        <Input placeholder='Please Enter PER'/>
      </Form.Item>
      <Form.Item name="CARGO_TYPE" label="Cargo Type">
        <Input placeholder='Please Enter Cargo Type'/>
      </Form.Item>
      <Form.Item name="CARGO_WEIGHT_MIN_MT" label="Cargo Weight Min (MT)">
        <InputNumber min={0} style={{width: "-webkit-fill-available"}} placeholder='Please Enter Cargo Weight Min (MT'/>
      </Form.Item>
      <Form.Item name="CARGO_WEIGHT_MAX_MT" label="Cargo Weight Max (MT)">
        <InputNumber min={0} style={{width: "-webkit-fill-available"}} placeholder='Please Enter Cargo Weight Max (MT)'/>
      </Form.Item>
      <Form.Item name="INCO_TERMS" label="INCO Terms">
        <Select mode="multiple" placeholder="Select INCO terms">
          <Option value="EX-WORKS">EX-WORKS</Option>
          <Option value="FCA">FCA</Option>
          <Option value="FOB">FOB</Option>
        </Select>
      </Form.Item>
      <Form.Item name="DESTINATION_COST_THC" label="THC Cost">
        <InputNumber min={0} placeholder='Please Enter THC Cost ' style={{width: "-webkit-fill-available"}} />
      </Form.Item>
      <Form.Item name="DESTINATION_COST_IHC" label="IHC Cost">
        <InputNumber min={0} style={{width: "-webkit-fill-available"}}  placeholder='Please Enter IHC Cost'/>
      </Form.Item>
      <Form.Item name="DESTINATION_COST_LOCAL_AND_DO" label="Local and DO Cost">
        <InputNumber min={0} style={{width: "-webkit-fill-available"}}  placeholder='Please Enter Local and DO Cost'/>
      </Form.Item>
      <Form.Item name="DESTINATION_COST_CIS" label="CIS Cost">
        <InputNumber min={0} style={{width: "-webkit-fill-available"}}  placeholder='Please Enter CIS Cost (if any)'/>
      </Form.Item>
      <Form.Item name="SHIPPING_LINE" label="Shipping Line">
        <Input style={{width: "-webkit-fill-available"}}  placeholder='Please Enter Shipping Line'/>
      </Form.Item>
      <Form.Item className='m-10'>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </Card>
  );
};

export default InputFields;
