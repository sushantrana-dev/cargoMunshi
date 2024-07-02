import React from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Card } from 'antd';
const { Option } = Select;
const InputFields = () => {
  const onFinish = async (values) => {
    response = await fetch("http://localhost:5050/record/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    console.log('Received values of form: INPUT DB ', values);
  };

  return (
    <Card title="Insert new Entry" desc="Please make sure that the Values are consistent across DB">
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="POD_NAME" label="POD Name">
        <Input />
      </Form.Item>
      <Form.Item name="DEL_NAME" label="DEL Name">
        <Input />
      </Form.Item>
      <Form.Item name="EFFECTIVE_DATE" label="Effective Date">
        <DatePicker />
      </Form.Item>
      <Form.Item name="PER" label="PER">
        <Input />
      </Form.Item>
      <Form.Item name="CARGO_TYPE" label="Cargo Type">
        <Input />
      </Form.Item>
      <Form.Item name="CARGO_WEIGHT_MIN_MT" label="Cargo Weight Min (MT)">
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item name="CARGO_WEIGHT_MAX_MT" label="Cargo Weight Max (MT)">
        <InputNumber max={7.5} />
      </Form.Item>
      <Form.Item name="INCO_TERMS" label="INCO Terms">
        <Select mode="multiple" placeholder="Select INCO terms">
          <Option value="EX-WORKS">EX-WORKS</Option>
          <Option value="FCA">FCA</Option>
          <Option value="FOB">FOB</Option>
        </Select>
      </Form.Item>
      <Form.Item name="DESTINATION_COST_THC" label="THC Cost">
        <InputNumber />
      </Form.Item>
      <Form.Item name="DESTINATION_COST_IHC" label="IHC Cost">
        <InputNumber />
      </Form.Item>
      <Form.Item name="DESTINATION_COST_LOCAL_AND_DO" label="Local and DO Cost">
        <InputNumber />
      </Form.Item>
      <Form.Item name="DESTINATION_COST_CIS" label="CIS Cost">
        <InputNumber />
      </Form.Item>
      <Form.Item name="SHIPPING_LINE" label="Shipping Line">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </Card>
  );
};

export default InputFields;