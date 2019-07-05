import React,{Component} from 'react'
import {connect} from 'dva';
import {NAMESPACE} from '@/constant/other'
import PageLoading from '@/components/PageLoading'
import SiderMenu from '@/components/SiderMenu'
import Header from './components/Header';
import logo from '@/assets/logo.jpg'
import styles from './_layout.css'
import {
    Row,
    Col
} from 'antd'

class MokeLayout extends Component{

    componentWillMount(){
        this.props.axiosMenu();
        this.props.axiosAllDict();
    }

    render(){
        const {children, menu, menuLoading, dictLoading} = this.props;
        return(
            <PageLoading spinning={menuLoading || dictLoading}>
                <div className={styles.wrapper}>
                    <Row>
                        <Col span={3} className={styles.left}>
                            <SiderMenu data={menu} src={logo}/>
                        </Col>
                        <Col span={21} className={styles.right}>
                            <Row className={styles.header}>
                                <Header/>
                            </Row>
                            <Row className={styles.content}>
                                <div className={styles.inner_content}>
                                    {children}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </PageLoading>
        );
    }
}

const mapStateToProps = ( {router, loading} ) =>{
    return {
        menu: router.menu,
        menuLoading: loading.effects[`${NAMESPACE.ROUTER_MODEL}/menu`],
        dictLoading: loading.effects[`${NAMESPACE.DICT_MODEL}/all`],
    }
};

const mapDispatchToProps = dispatch => {
    return {
        axiosMenu: () => {
            dispatch({
                type:`${NAMESPACE.ROUTER_MODEL}/menu`,
            });
        },
        axiosAllDict: () => {
            dispatch({
                type:`${NAMESPACE.DICT_MODEL}/all`,
            });
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(MokeLayout);
