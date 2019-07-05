import React from 'react';
import { Modal } from 'antd';
import styles from './index.css';

export default ({ title, src, alt, visible, onCancel }) => {
    return (
        <Modal title={title} footer={false} visible={visible} onCancel={onCancel}>
            <img src={src} alt={alt} className={styles.modal_img}/>
        </Modal>
    );
};
