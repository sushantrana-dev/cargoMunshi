import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Card, Space, InputNumber, notification, Modal } from 'antd';
import { formatData, getUniqueOptions } from '../../components/util';
import '../../components/Starter/style.scss';
import { EditOutlined } from '@ant-design/icons';
import ModalComponent from '../Modal/Modal';
import { isEmpty } from 'lodash';
import QuotationCard from './Quotation';
import { HOST_ENDPOINT } from '../../components/Starter/Constants';
// const [api, contextHolder] = notification.useNotification();
// const openNotification = ({ message, description, placement = 'top' }) => {
//     api.info({
//         message: `${message}`,
//         description: `${description}`,
//         placement,
//     });
// };
const FreightForm = (props) => {
    const { freightKeys, dbFlow, selectedOption, selectedValues: originDestination } = props;
    const [selectedIncoTerm, setSelectedIncoTerm] = useState('');
    const [form] = Form.useForm();
    const [quotation, setQuotation] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
    const [selectOptions, setSelectOptions] = useState({
        PER: [],
        CARGO_TYPE: [],
    });
    const [selectedCosts, setSelectedCosts] = useState([]);

    const handleCostChange = (values) => {
        setSelectedCosts(values);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModalFlags = () => {
        console.log('flag:')
        setQuotation({});
        setIsModalOpen(false);
    }
    const toggleModalFlagClose = () => {
        setIsModalOpen(false);
    }
    useEffect(() => {
        const loadData = () => {
            const formattedData = {
                ...formatData(getUniqueOptions(freightKeys, 'PER')),
                ...formatData(getUniqueOptions(freightKeys, 'CARGO_TYPE')),
            };
            console.log('formattedData', formattedData);
            setSelectOptions(formattedData);
        };
        console.log('freightKeys in useEffect', freightKeys);
        loadData();
    }, []);
    async function fetchData(values) {

        const allParameters = { ...values, podName: originDestination?.podName, delName: originDestination?.delName, shippingLine: selectedOption };
        // Construct query string from params object
        const queryString = new URLSearchParams(allParameters).toString();

        // Append query string to the base URL
        const url = `${HOST_ENDPOINT}record/freightRates/calculation?${queryString}`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                // openNotification({ message: response.status, description: 'Please try again later' })
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Assuming the server responds with JSON data
            return data;
        } catch (error) {
            // openNotification({ message: response.status, description: 'Please try again later' })
            console.error('Error:', error);
        }
    }

    async function updateDb(values) {
        // Construct query string from params object
        const queryString = new URLSearchParams(values).toString();

        // Append query string to the base URL
        const url = `${HOST_ENDPOINT}record/update`;
        try {
            const response = await fetch(url,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...values, shipping_line: selectedOption, pod_name: freightKeys?.[0].POD_NAME, del_name: freightKeys?.[0].DEL_NAME }),
                });

            if (!response.ok) {
                // openNotification({ message: response.status, description: 'Please try again later' })
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                // openNotification({ message: response.status, description: '' })
            }

            const data = await response.json(); // Assuming the server responds with JSON data
            return data;
        } catch (error) {
            // openNotification({ message: response.status, description: 'Please try again later' })
            console.error('Error:', error);
        }
    }



    const onFinish = async (values) => {
        console.log('Received values from onFinish: ', values);
        // console.log('Full Form Values:', form.getFieldsValue(true));
        const returnedVals = dbFlow ? await updateDb(values) : await fetchData(values);
        console.log('selectOptions', returnedVals);
        setQuotation(returnedVals);
        setSelectedValues(values);
    };

    return (
        <>
            {/* {contextHolder} */}
            {isEmpty(quotation) ?
                <Card title="Step:3" bordered={false} className='global-card card-common '>
                    <Form layout="vertical" className='global-form-flex'
                        form={form}
                        onFinish={onFinish}>
                        <Form.Item label="PER" name="per"
                            rules={[{ required: true, message: 'Please select a PER' }]}>
                            <Select
                                showSearch
                                placeholder="Select PER"
                                optionFilterProp="label"
                                onChange={(value) => form.setFieldsValue({ PER: value })}
                                options={selectOptions?.PER ?? []}
                            />
                        </Form.Item>
                        <Form.Item label="Cargo Type" name="cargoType"
                            rules={[{ required: true, message: 'Please select a cargo type' }]}>
                            <Select
                                showSearch
                                placeholder="Select Cargo Type"
                                optionFilterProp="label"
                                onChange={(value) => form.setFieldsValue({ CARGO_TYPE: value })}
                                options={selectOptions?.CARGO_TYPE ?? []}
                            />
                        </Form.Item>
                        <Form.Item label="Weight in Metric Tonnes" name="weightRange"
                            rules={[{ required: true, message: 'Please enter the weight in MT' }]}>
                            <InputNumber min={0} placeholder="Enter Weight in MT" className='w-auto' />
                        </Form.Item>
                        {!dbFlow ? (
                            <div className='flex gap-3 flex-wrap'>
                                <Form.Item label="INCO TERMS" name="incoTerms"
                                    rules={[{ required: true, message: 'Please select INCO terms' }]}>
                                    <Radio.Group onChange={e => setSelectedIncoTerm(e.target.value)}>
                                        <Radio className='text-white' value="EX_WORKS">EX WORKS</Radio>
                                        <Radio className='text-white' value="FCA">FCA</Radio>
                                        <Radio className='text-white' value="FOB">FOB</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <div>{(selectedIncoTerm === 'EX_WORKS' || selectedIncoTerm === 'FCA') && (
                                    <>
                                        <Form.Item label={`${selectedIncoTerm} Exchange Rate`} name="incoExchangeRate"
                                            rules={[{ required: true, message: `Please enter ${selectedIncoTerm} Exchange Rate` }]}>
                                            <InputNumber className='w-auto' min={0} placeholder={`Enter ${selectedIncoTerm} Exchange Rate`} />
                                        </Form.Item>
                                        <Form.Item label={`Price Rate`} name="incoPriceRate"
                                            rules={[{ required: true, message: `Please enter ${selectedIncoTerm} PRICE Rate` }]}>
                                            <InputNumber min={0} placeholder={`Enter ${selectedIncoTerm} PRICE Rate`} className='w-auto' />
                                        </Form.Item>
                                    </>
                                )}</div>
                                <Form.Item label="Ocean Freight Price" name="oceanFreightExPrice"
                                    rules={[{ required: true, message: 'Please enter the Ocean Freight Price' }]}>
                                    <InputNumber min={0} placeholder="Enter Price" className='w-auto' />
                                </Form.Item>
                                <Form.Item label="Ocean Freight Exchange Rate" name="oceanFreightExRate"
                                    rules={[{ required: true, message: 'Please enter the Ocean Freight Exchange Rate' }]}>
                                    <InputNumber min={0} placeholder="Enter Exchange Rate" className='w-auto' />
                                </Form.Item>
                            </div>
                        ) :
                            <div className='update-section'> Enter the Values to be Updated in the DB
                                <Form.Item label="Select Keys to Update" name="selectedCosts">
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Select costs"
                                        onChange={handleCostChange}
                                    >
                                        <Option value="THC">THC Cost</Option>
                                        <Option value="IHC">IHC Cost</Option>
                                        <Option value="LOCAL_AND_DO">Local and D/O Cost</Option>
                                        <Option value="CIS">CIS Cost</Option>
                                    </Select>
                                </Form.Item>
                               <div className='val-selection'>{selectedCosts.includes('THC') && (
                                    <Form.Item label="THC Cost" name="THC"
                                        rules={[{ required: true, message: 'Please enter the THC Cost' }]}>
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                )}

                                {selectedCosts.includes('IHC') && (
                                    <Form.Item label="IHC Cost" name="IHC"
                                        rules={[{ required: true, message: 'Please enter the IHC Cost' }]}>
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                )}

                                {selectedCosts.includes('LOCAL_AND_DO') && (
                                    <Form.Item label="Local and DO Cost" name="LOCAL_AND_DO"
                                        rules={[{ required: true, message: 'Please enter the Local and DO Cost' }]}>
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                )}

                                {selectedCosts.includes('CIS') && (
                                    <Form.Item label="CIS Cost" name="CIS"
                                        rules={[{ required: true, message: 'Please enter the CIS Cost' }]}>
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                )}
</div>

                                {/* <Form.Item name="DESTINATION_COST_THC" label="THC Cost"
                       rules={[{ required: true, message: 'Please enter the THC Cost' }]}>
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="DESTINATION_COST_IHC" label="IHC Cost"
                       rules={[{ required: true, message: 'Please enter the IHC Cost' }]}>
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="DESTINATION_COST_LOCAL_AND_DO" label="Local and DO Cost"
                       rules={[{ required: true, message: 'Please enter the Local and DO Cost' }]}>
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="DESTINATION_COST_CIS" label="CIS Cost"
                       rules={[{ required: true, message: 'Please enter the CIS Cost' }]}>
                <InputNumber min={0} />
            </Form.Item> */}
                            </div>}
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit">
                                {dbFlow ? 'Make Updates' : 'Get Quotation'}
                            </Button>
                        </Form.Item>
                    </Form></Card> : <> <ModalComponent isModalOpen={isModalOpen} handleOK={toggleModalFlags} handleClose={toggleModalFlagClose} />
                    <Space size="middle" direction="horizontal" className='configured-card card-common'>
                        <div className='m-4 flex gap-2 flex-wrap'><span>Selected cargoType:
                            <b> {selectedValues?.cargoType}</b></span>
                            <span>Selected PER :
                                <b> {selectedValues?.per} Pieces</b></span>
                            <span>Selected Weight:
                                <b> {selectedValues?.weightRange} Mt</b></span>
                            <span>Selected Inco Term :
                                <b> {selectedValues?.incoTerms}</b></span>
                            <span>Selected Ocean Freight Rate :
                                <b> {selectedValues?.oceanFreightExRate}</b></span>

                        </div>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => { setIsModalOpen(true) }} >
                            Edit
                        </Button>
                    </Space>
                    {/* <Modal centered open={true} 
                    footer={[
          <Button key="submit" onClick={toggleModalFlagClose}>
            Print
          </Button>,
          <Navigate to="/" key="cancel" type="primary">
            Start Again
          </Navigate>,
        ]} handleOK={toggleModalFlags} handleClose={toggleModalFlagClose}>
                        
                    </Modal> */}
                    <QuotationCard selectedValues={{
                        shippingLine: selectedOption,
                        odValues: originDestination,
                    }} quotation={quotation} />
                </>}</>
    );
};

export default FreightForm;
