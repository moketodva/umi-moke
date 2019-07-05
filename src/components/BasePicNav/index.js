import styles from './index.css';
import Icon from '@/components/IconFont';

export default ({ data }) => {

    const renderNav = (data = []) => {
        return data.map((item, index) => {
            return (
                <li key={index}>
                    <a href={item.url} target='_blank'>
                        <Icon type={item.iconfont.default} className={`icon ${styles.nav_icon}`}/>
                        <span>{item.name}</span>
                    </a>
                </li>
            );
        });
    };

    return (
        <ul className={styles.nav_ul}>
            {renderNav(data)}
        </ul>
    );
}
