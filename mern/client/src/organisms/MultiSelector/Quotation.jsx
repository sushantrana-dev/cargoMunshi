import React from 'react';
import { Card, Statistic, Row, Col, Collapse, Button } from 'antd';
import CountUp from 'react-countup';
import ExportToExcel from '../File/ExportToExcel';
import '../../components/Starter/style.scss';
import { NavLink } from "react-router-dom";
import {
  SyncOutlined,
} from '@ant-design/icons';

const QuotationCard = ({ quotation, selectedValues }) => {
  console.log('quotation', quotation, selectedValues);

  const updatedCalculatedData = {
    DESTINATION_COST: {
      'Inland Haulage Charges': quotation.IHC,
      'Terminal Handling Charges': quotation.THC,
      'Local and DO Charges': quotation.LOCAL_AND_DO,
      'CIS Charges': quotation.CIS,
      'DESTINATION_COST': quotation.DESTINATION_COST,
    },
    TOTAL_COST_WITH_GST: {
      'Total Cost without GST': quotation.TOTAL_COST_WITH_GST - (quotation.GST_5 + quotation.GST_18),
      '5% GST APPLIED': quotation.GST_5,
      '18% GST APPLIED': quotation.GST_18,
      'TOTAL_COST_WITH_GST': quotation.TOTAL_COST_WITH_GST,
    },
  }


  const FinancialOverview = ({ data }) => {
    const { Panel } = Collapse;

    // Utility function to format and display each statistic
    const renderStatistics = (details) => (
      <Row gutter={16} className='mt-4 p-2'>
        {Object.entries(details).map(([key, value], index) => (
          <Col key={index} span={12} className="mb-4">
            <Statistic
              title={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} // Format title to be more readable
              value={value}
              precision={typeof value === 'number' && !Number.isInteger(value) ? 2 : 0}
              formatter={value => <div className="statistic-internal-value">Rs. <CountUp end={value} separator="," /></div>}
            />
          </Col>
        ))}
      </Row>
    );

    return (
      <Collapse className='text-white mt-4' defaultActiveKey={['1']} accordion>
        {Object.entries(data).map(([key, values], index) => (
          <Panel
            header={
              <Statistic
                className="statistic-header"
                title={<div className="text-white text-xl">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>} // Format title to be more readable
                value={values[key]}
                precision={typeof values[key] === 'number' && !Number.isInteger(values[key]) ? 2 : 0}
                formatter={value => <div className="statistic-value">Rs.<CountUp end={value} separator="," /></div>}
              />
            }
            key={index + 1}>
            {renderStatistics(values)}
          </Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <Card title="Quotation" bordered={false} className='global-card card-common '>
      <div className='mb-2 mt-2'>Showing Quotation for  <b>{selectedValues.shippingLine}</b> from {selectedValues.odValues.podName} to {selectedValues.odValues.delName}</div>
      <FinancialOverview data={updatedCalculatedData} />
      <div className='mt-4 flex justify-between gap-2'>
        <ExportToExcel data={updatedCalculatedData} fileName="quotation" />
        <Button className='mb-4 mt-4' onClick={()=>{ window.location.reload(false);}}> <SyncOutlined className='mr-2'/>Start Over</Button></div>
    </Card>
  );
};

export default QuotationCard;
