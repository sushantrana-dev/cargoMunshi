import React, { useMemo, useState } from 'react';
import { Card, Typography, Select, Form, Button, notification, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import ModalComponent from '../Modal/Modal';
import FreightForm from '../MultiSelector';

const { Option } = Select;

const OriginDestinationComp = ({ record, setSpinnerTrue, dbFlow ,selectedOption}) => {
    const [freightKeys, setFreightKeys] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPod, setSelectedPod] = useState(null);
    const [form] = Form.useForm();
    const [notificationApi, contextHolder] = notification.useNotification();

    // Compute unique POD_NAME options
    const podOptions = useMemo(() => {
        const pods = new Set(record.map(item => item.POD_NAME));
        return Array.from(pods).map(pod => ({ label: pod, value: pod }));
    }, [record]);

    // Compute DEL_NAME options based on selected POD_NAME
    const delOptions = useMemo(() => {
        return selectedPod ? record.filter(item => item.POD_NAME === selectedPod).map(item => ({
            label: item.DEL_NAME,
            value: item.DEL_NAME
        })) : [];
    }, [record, selectedPod]);

    const handleFormSubmit = async values => {
        setSpinnerTrue(true);
        try {
            const queryString = new URLSearchParams(values).toString();
            const response = await fetch(`http://cargo-munshi-server.vercel.app/record/freightRates?${queryString}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSelectedValues(values);
            setFreightKeys(data);
        } catch (error) {
            notificationApi.error({
                message: 'Error fetching data',
                description: error.message,
                placement: 'topRight'
            });
        } finally {
            setSpinnerTrue(false);
        }
    };

    const openEditModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setFreightKeys([]);
        setIsModalOpen(false)};

    return (
        <>
            {contextHolder}
            {isEmpty(freightKeys) ? (
                <Card className="global-card card-common " title="Step: 2 Please Select the POD_NAME and DEL_NAME">
                    <Form form={form} onFinish={handleFormSubmit} layout="vertical" style={{color: 'white'}} className='global-form-flex'>
                        <Form.Item
                            name="podName"
                            label="POD_NAME"
                            rules={[{ required: true, message: 'Please select a POD_NAME!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select POD_NAME"
                                onChange={setSelectedPod}
                                style={{ width: 200, marginRight: 20 }}
                            >
                                {podOptions.map(option => (
                                    <Option key={option.value} value={option.value}>{option.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="delName"
                            label="DEL_NAME"
                            rules={[{ required: true, message: 'Please select a DEL_NAME!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select DEL_NAME"
                                style={{ width: 200 }}
                                disabled={!selectedPod}
                            >
                                {delOptions.map(option => (
                                    <Option key={option.value} value={option.value}>{option.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit">
                                Next
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                <>
                    <ModalComponent isModalOpen={isModalOpen} handleOK={closeModal} handleClose={closeModal} />
                    <Space size="middle" direction="horizontal" className="configured-card card-common">
                        <div className="mt-1 flex gap-3">
                            <span>Selected POD NAME: {selectedValues.podName}</span>
                            <span>Selected DEL NAME: {selectedValues.delName}</span>
                        </div>
                        <Button type="primary" icon={<EditOutlined />} onClick={openEditModal}>
                            Edit
                        </Button>
                    </Space>
                    <FreightForm freightKeys={freightKeys} selectedValues={selectedValues} selectedOption={selectedOption} dbFlow={dbFlow}/>
                </>
            )}
        </>
    );
};

export default OriginDestinationComp;
