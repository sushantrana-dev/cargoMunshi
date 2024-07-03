import React, { useState } from 'react';

import { Card, Select, notification, Space, Button, Typography, Modal, Spin } from 'antd';
import OriginDestination from '../../organisms/OriginDestination'
import { HOST_ENDPOINT, SHIPPING_OPTIONS } from './Constants';
import isEmpty from 'lodash/isEmpty';
import './style.scss';
import { formatData } from '../util';
import { EditOutlined } from '@ant-design/icons';
const Starter = (props) => {
    const { dbFlow } = props;
    const [selectedOption, setSelectedOption] = useState('');
    const [record, setRecord] = useState({});//[PODNames, DELNames]
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [spinnerTrue, setSpinnerTrue] = useState(false);
    const toggleModalFlags = () => {
        console.log('flag:')
        setIsModalOpen(true);
    }
    const toggleModalFlagFalse = () => {
        console.log('flag:')
        setIsModalOpen(false);
    }
    const onChange = (value) => {
        setSelectedOption(value);

        console.log(`selected ${value}`);
    };

    const [api, contextHolder] = notification.useNotification();
    const openNotification = ({ message, description, placement = 'top' }) => {
        api.info({
            message: `${message}`,
            description: `${description}`,
            placement,
            showProgress: true,
        });
    };

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${HOST_ENDPOINT}record/shippingLine/${selectedOption}`
            );
            console.log('Response:', response);
            setSpinnerTrue(false);
            const message = `Record not found for ShippingLine: ${selectedOption}`;
            if (!response?.ok) {
                // Render error using state or context or handle it within UI differently as Alert cannot be rendered here directly
                openNotification({ message, description: 'Please try again later in 10' })
                return;
            }

            const record = await response.json();
            if (!record) {
                openNotification({ message, description: 'Please try again later' })
                navigate("/");
                return;
            } else {

                // const updatedValues = formatData(record)
                // console.log('Record: updatedValues', updatedValues)
                setRecord(record?.[0]?.mappings);
                // console.log('Record:', record);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            openNotification({ message: error, description: 'Please try again later in 100' })
            // Handle fetch error, e.g., network error, server error, JSON parsing error
        }
    }
    const handleNextClick = () => {
        setSpinnerTrue(true);
        // Do something with the selected option
        fetchData();
    };
    const toggleEditFlow = () => {
        setIsModalOpen(false);
        setRecord({});
    }
    const ORG_NAME = "CONTER SHIPPING";
    const cardTitle = dbFlow ? "Update any existing Entry" : `Welcome ${ORG_NAME} ,  Start Generating Quotation:`;
    return (
        <Spin
            spinning={spinnerTrue}>
            <Card title={cardTitle} className='global-card'>
                {contextHolder} {/* Notification holder */}
                {
                    (!isEmpty(record)) ?
                        (
                            <>
                                <Modal title="Alert" open={isModalOpen} onOk={toggleEditFlow} onCancel={toggleModalFlagFalse}
                                    footer={(_, { OkBtn, CancelBtn }) => (
                                        <>
                                            <CancelBtn />
                                            <OkBtn />
                                        </>
                                    )}
                                >
                                    <p>Editing will revert all the Changes</p>
                                </Modal>
                                <Space size="middle" direction="horizontal" className='configured-card card-common '>
                                    <div className='mt-1'>Selected Shipping Line : <Space />
                                        <b>{selectedOption}</b>
                                    </div>
                                    <Button type="primary" icon={<EditOutlined />} onClick={toggleModalFlags} >
                                        Edit
                                    </Button>
                                </Space>
                                <OriginDestination record={record} dbFlow={dbFlow} setSpinnerTrue={setSpinnerTrue} selectedOption={selectedOption}/>
                            </>
                        )
                        :
                        (
                            <Card className='global-card card-common ' title="Step:1 Please Select the Shipping Line">
                                <Space>
                                    <Select
                                        className='starter-select'
                                        showSearch
                                        placeholder="Select a Shipping Line"
                                        optionFilterProp="label"
                                        onChange={onChange}
                                        options={SHIPPING_OPTIONS}
                                    />
                                    <Button type="primary" size="large" onClick={handleNextClick}>Next</Button>
                                </Space>
                            </Card>
                        )
                }
            </Card>
        </Spin>
    );
};

export default Starter;
