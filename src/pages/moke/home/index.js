import { Component } from 'react';
import { Card, Row, Col, Modal, Tabs } from 'antd';
import styles from './index.css';
import {img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16} from '@/assets/gallery';

const TabPane = Tabs.TabPane;

class GalleryPage extends Component{
    state={
        visible: false,
        tabs: []
    };

    componentWillMount(){
        // api获取数据
        const tabs = [
            {
                key: '1',
                tab: '图片画廊1',
                imgs: [
                    [img1,img2,img3,img4],
                    [img5,img6,img7,img8],
                    [img9,img10,img12,img12],
                    [img13,img14,img15,img16]
                ]
            },{
                key:'2',
                tab:'图片画廊2',
                imgs: [
                    [img16,img15,img14,img13],
                    [img12,img11,img10,img9],
                    [img8,img7,img6,img5],
                    [img4,img3,img2,img1]
                ]
            }
        ];
        // 更新状态
        this.setState({
            tabs
        });
    }

    /**
     * 图片点击事件处理
     * @param e
     */
    handleClick = (e) => {
        this.setState({
            visible: true,
            img: e.target.alt
        });
    };

    /**
     * 弹框点击取消事件处理
     */
    handleCancel = () =>{
        this.setState({
            visible:false,
        });
    };

    /**
     * Tab组件渲染
     * @param tabs
     * @returns {*}
     */
    renderTabs = (tabs) => {
        const tabPanes = tabs.map((tab) =>
            <TabPane key={tab.key} tab={tab.tab}>
                <div>
                    {this.renderGallery(tab.imgs)}
                </div>
            </TabPane>
        );
        return (
            <Tabs defaultActiveKey={'1'}>
                {tabPanes}
            </Tabs>
        );
    };

    /**
     * Gallery组件渲染
     * @param imgs
     * @returns {*}
     */
    renderGallery = (imgs)=>{
        const cols = imgs.map((item, index) =>
            <Col key={index} md={6}>{item.map((ele, index) => {
                return <Card hoverable key={index} className={styles.card} cover={<img src={ele} alt={ele} onClick={this.handleClick}/>}  />;
            })}</Col>,
        );
        return (
            <div>
                <Row gutter={8}>
                    {cols}
                </Row>
                <Modal  title={'图片画廊'} footer={false} visible={this.state.visible} onCancel={this.handleCancel} >
                    <img src={this.state.img} alt={this.state.img} className={styles.modal_img}/>
                </Modal>
            </div>
        );
    };

    render(){
        return(
            <div className={styles.wrapper}>
                {this.renderTabs(this.state.tabs)}
            </div>
        );
    }
}

export default GalleryPage;
