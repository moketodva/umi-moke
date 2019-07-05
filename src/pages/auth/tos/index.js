import styles from './index.css'

export default ()=>{
    return (
        <div className={styles.wrapper}>
            <h2 className={`${styles.title} ${styles.bold}`}>服务条款</h2>
            <p className={`${styles.time} ${styles.bold}`}>2018年12月版</p>
            <p className={`${styles.time} ${styles.bold}`}>前言</p>
            <p/>
            <p className={`${styles.content} ${styles.bold}`}>欢迎访问网站并使用我们提供的产品和服务</p>
            <p/>
            <p className={`${styles.content} ${styles.bold}`}>在完成注册程序或以任何方式使用网站服务前，请您务必仔细阅读并透彻理解本网站服务条款(以下或简称“服务条款”)，在确认充分理解后选择接受或不接受本服务条款；一旦您完成“同意条款并注册”或开始以其他方式使用服务，即表明您已阅读并同意受本服务条款的约束。如您不同意本服务条款或其中任何条款约定，您应不再进行下一步或停止注册程序。</p>
            <p/>
            <p className={`${styles.content} ${styles.bold}`}>一、服务条款一</p>
            <p className={`${styles.content} ${styles.bold}`}><span>1.1.</span><span>服务条款一内容</span></p>
            <p className={`${styles.content} ${styles.bold}`}>二、服务条款二</p>
            <p className={`${styles.content} ${styles.bold}`}><span>2.1.</span><span>服务条款二内容</span></p>
            <p className={`${styles.content} ${styles.bold}`}>三、服务条款三</p>
            <p className={`${styles.content} ${styles.bold}`}><span>3.1.</span><span>服务条款三内容</span></p>
        </div>
    );
}
