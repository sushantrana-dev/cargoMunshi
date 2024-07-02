import React from 'react';
import '../../components/Starter/style.scss';
import { Modal } from 'antd';

const ModalComponent = ({ isModalOpen, handleOK, handleClose }) => {
    return (
        <Modal
            title="Please note"
            open={isModalOpen}
            onOk={handleOK}
            onCancel={handleClose}
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            )}
        >
            <p>Editing this information will erase any dependent data in the following steps.</p>        </Modal>
    );
};

export default ModalComponent;
