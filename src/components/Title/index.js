import React from 'react';
import styles from './index.css';

export default ({ value = '' }) => {
    return (
        <h2 className={styles.title}>{value}</h2>
    );
}
