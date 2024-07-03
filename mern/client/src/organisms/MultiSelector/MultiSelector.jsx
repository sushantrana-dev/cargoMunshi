import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Card, Space, InputNumber, notification } from 'antd';
import { formatData, formatWeightRanges, getUniqueOptions } from '../../components/util';
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
    const { freightKeys, dbFlow, selectedOption } = props;
    // console.log('freightKeys', selectedOption);
    const [selectedIncoTerm, setSelectedIncoTerm] = useState('');
    const [formMS] = Form.useForm();
    const [quotation, setQuotation] = useState({});
    const [selectedValues, setSelectedValues] = useState({});
    const [selectOptions, setSelectOptions] = useState({
        PER: [],
        CARGO_TYPE: [],
    });
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
        // Construct query string from params object
        const queryString = new URLSearchParams(values).toString();

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
        // console.log('Full Form Values:', formMS.getFieldsValue(true));
        const returnedVals = dbFlow ? await updateDb(values) : await fetchData(values);
        console.log('selectOptions', returnedVals);
        setQuotation(returnedVals);
        setSelectedValues(values);
    };

    return (
        <>
            {/* {contextHolder} */}
            {isEmpty(quotation) ?
                <Card title="Step:3" className='global-card card-common '>
                    <Form layout="vertical" className='global-form-flex'
                        form={formMS}
                        onFinish={onFinish}>
                        <Form.Item label="PER" name="per">
                            <Select
                                showSearch
                                placeholder="Select PER"
                                optionFilterProp="label"
                                onChange={(value) => form.setFieldsValue({ PER: value })}
                                options={selectOptions?.PER ?? []}
                            />
                        </Form.Item>
                        <Form.Item label="Cargo Type" name="cargoType">
                            <Select
                                showSearch
                                placeholder="Select PER"
                                optionFilterProp="label"
                                onChange={(value) => form.setFieldsValue({ CARGO_TYPE: value })}
                                options={selectOptions?.CARGO_TYPE ?? []}
                            />
                        </Form.Item>
                        <Form.Item label="Weight Range" name="weightRange">
                            <Input placeholder="Enter Weight in KG" />
                        </Form.Item>
                        {!dbFlow ? (<>
                        <div>
                        <Form.Item label="INCO TERMS" name="incoTerms">
                            <Radio.Group onChange={e => setSelectedIncoTerm(e.target.value)}>
                                <Radio value="EX_WORKS" className='text-white'>EX WORKS</Radio>
                                <Radio value="FCA" className='text-white'>FCA</Radio>
                                <Radio value="FOB" className='text-white'>FOB</Radio>
                            </Radio.Group>
                        </Form.Item>
                            <div>{(selectedIncoTerm === 'EX_WORKS' || selectedIncoTerm === 'FCA') && (
                                <>
                                    <Form.Item label={`${selectedIncoTerm} Exchange Rate`} name="incoExchangeRate">
                                        <InputNumber min={0} placeholder={`Enter ${selectedIncoTerm} Exchange Rate`} className='w-auto' />
                                    </Form.Item>
                                    <Form.Item label={`Price Rate`} name="incoPriceRate">
                                        <InputNumber min={0} placeholder={`Enter ${selectedIncoTerm} PRICE Rate`} className='w-auto' />
                                    </Form.Item>
                                </>
                            )}</div>
                            </div>
                            <Form.Item label="Ocean Freight Price" name="oceanFreightExPrice">
                                <InputNumber min={0} placeholder="Enter Price" className='w-auto'
                                />
                            </Form.Item>
                            <Form.Item label="Ocean Freight Exchange Rate" name="oceanFreightExRate">
                                <InputNumber min={0} placeholder="Enter Exchange Rate" className='w-auto'
                                />
                            </Form.Item></>) :
                            <div className='update-section'> Enter the Values to be Updated in the DB
                                <Form.Item name="DESTINATION_COST_THC" label="THC Cost">
                                    <InputNumber min={0} />
                                </Form.Item>
                                <Form.Item name="DESTINATION_COST_IHC" label="IHC Cost">
                                    <InputNumber min={0} />
                                </Form.Item>
                                <Form.Item name="DESTINATION_COST_LOCAL_AND_DO" label="Local and DO Cost">
                                    <InputNumber min={0} />
                                </Form.Item>
                                <Form.Item name="DESTINATION_COST_CIS" label="CIS Cost">
                                    <InputNumber min={0} />
                                </Form.Item></div>}
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit">
                                {dbFlow ? 'Make Updations' : 'Get Quotation'}
                            </Button>
                        </Form.Item>
                    </Form></Card> : <> <ModalComponent isModalOpen={isModalOpen} handleOK={toggleModalFlags} handleClose={toggleModalFlagClose} />
                    <Space size="middle" direction="horizontal" className='configured-card card-common'>
                        <div className='mt-1 flex gap-4 flex-wrap'><span>Selected cargoType:
                            <b>{selectedValues?.cargoType}</b></span>
                            <span>Selected Inco Term :
                                <b>{selectedValues?.incoTerms}</b></span>
                            <span>Selected Ocean Freight Rate :
                                <b>{selectedValues?.oceanFreightExRate}</b></span>
                            <span>Selected PER :
                                <b>{selectedValues?.per}</b></span>
                            <span>Selected Weight Range:
                                <b>{selectedValues?.weightRange}</b></span>
                        </div>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => { setIsModalOpen(true) }} >
                            Edit
                        </Button>
                    </Space>
                    <QuotationCard quotation={quotation} />
                </>}</>
    );
};

export default FreightForm;
