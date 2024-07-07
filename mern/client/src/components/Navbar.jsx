import { NavLink } from "react-router-dom";
import deliverySvg from '../assets/delivery-truck.gif';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Modal, Space, Tooltip, notification } from "antd";
import { useState } from "react";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../organisms/Auth/AuthContext';
import { HOST_ENDPOINT } from "./Starter/Constants";

export default function Navbar() {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: 'Invalid Credentials !',
      description:'Please try again with correct credentials',
      duration: 5,
    });
  };
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(false);
    setOpen(false);
    navigate('/create');
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const handleClick = () => {
    navigate('/');
  };
  async function fetchData(values) {
    setConfirmLoading(true);
    try {
      const response = await fetch(`${HOST_ENDPOINT}user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
console.log('response', response);
return response;

    } catch (error) {
      // openNotification({ message: response.status, description: 'Please try again later' })
      console.error('Error:', error);
    }
  }
  const onFinish = async (values) => {
    console.log('ONfinish',values);
    const returnedVals = await fetchData(values);
    console.log('returnedVals',returnedVals);
    if(returnedVals.status === 200){
      login(true);
      handleOk();
    }
      else{
        login(false);
        openNotification();
      }
  };

  const location = useLocation(); // Access location object

  // Check if the pathname includes '/create'
  const isDBRoute = location.pathname.includes('/create');
  return (
    <div>
      {contextHolder}
      <Modal
        title="Admin Access Required !"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <nav className="flex justify-between items-center mb-6 nav-bar-mobile">
        <NavLink to="/"><Space align="center"> <img alt="CargoMunshi logo" className="h-20 inline rounded-3xl" src={deliverySvg}></img> <span className="mt-5 text-white">CARGO MUNSHI </span></Space></NavLink>
        {!isDBRoute ?
          <Tooltip title="DB related operations can be performed here">
            <Button type="link" onClick={showModal}>
              DataBase Interaction
            </Button>
          </Tooltip> :
          <Button type="link" onClick={handleClick}>
            Home
          </Button>}
      </nav>
    </div>
  );
}
