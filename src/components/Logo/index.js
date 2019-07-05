import styles from './index.css';

export default ({ src }) => {
    return (
        <img src={src} className={styles.logo} alt='logo'/>
    );
}
