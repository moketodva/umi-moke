import React from 'react';
import styles from './index.css';
import Logo from '@/components/Logo';
import BaseMenu from '@/components/BaseMenu';


export const SiderMenu = ({ data, src }) => {
    return (
        <div>
            <div className={styles.logo}>
                <Logo src={src}/>
            </div>
            <div className={styles.menu}>
                <BaseMenu data={data}/>
            </div>
        </div>
    );
};

export default SiderMenu;
