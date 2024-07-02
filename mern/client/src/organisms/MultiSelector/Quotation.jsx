import React, { useState } from 'react';
import { Card, Modal, Button } from 'antd';

const QuotationCard = ({ quotation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const showModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Card title="Quotation" className='global-card'>
        {/* <p>Destination Cost: {quotation?.DESTINATION_COST}</p>
        <p>Ocean Freight: {quotation?.OCEAN_FREIGHT}</p> */}
        <div className="inline-grid gap-3">
        <Button type="link" onClick={() => showModal(`Ocean Freight: ${quotation?.OCEAN_FREIGHT}\nDestination Cost: ${quotation?.DESTINATION_COST}`)}>
          Total Cost without GST: {quotation?.OCEAN_FREIGHT + quotation?.DESTINATION_COST}
        </Button>
        {/* <p>GST 5%: {quotation?.GST_5?.toFixed(1)}</p>
        <p>GST 18%: {quotation?.GST_18?.toFixed(1)}</p> */}
        <Button type="link" onClick={() => showModal(`Total Cost: ${quotation?.TOTAL_COST_WITH_GST}\nGST 5%: ${quotation?.GST_5?.toFixed(1)}\nGST 18%: ${quotation?.GST_18?.toFixed(1)}`)}>
          Total Cost with GST: {quotation?.TOTAL_COST_WITH_GST}
        </Button>
        </div>
      </Card>

      <Modal title="Cost Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <pre>{modalContent}</pre>
      </Modal>
    </>
  );
};

export default QuotationCard;