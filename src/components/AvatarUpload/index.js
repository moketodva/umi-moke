import React, { PureComponent } from 'react';
import { Upload, Icon, message } from 'antd';

class AvatarUpload extends PureComponent {

    constructor(props) {
        super(props);
        const avatarUrl = props.avatar;
        this.state = { avatarUrl };
    }

    componentWillReceiveProps(nextProps) {
        if ('avatar' in nextProps) {
            const avatarUrl = nextProps.avatar;
            this.setState({ avatarUrl });
        }
    }

    handleUploadChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'error') {
            this.props.onError(info.file.response);
            return;
        }
        if (info.file.status === 'done') {

            if (!info.file.response || !info.file.response.data) {
                message.error('未接收到图片路径!');
                this.setState({
                    loading: false,
                });
                return;
            }

            this.setState({
                avatarUrl: info.file.response.data,
                loading: false,
            });
            this.onParentChange(info.file.response);
        }

    };

    onParentChange = response => {
        this.props.onChange(response.data);
    };

    beforeUpload = file => {
        const isSupportType = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isSupportType) {
            message.error('不支持该图片格式!');
        }
        const isLt512KB = file.size / 1024 / 1024 < 0.5;
        if (!isLt512KB) {
            message.error('图片大小不超过512KB!');
        }
        return isSupportType && isLt512KB;
    };

    render() {
        const { name, action, headers } = this.props;
        const { avatarUrl } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className='ant-upload-text'>Upload</div>
            </div>
        );

        return (
            <Upload
                name={name}
                headers={headers}
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                action={action}
                beforeUpload={this.beforeUpload}
                onChange={this.handleUploadChange}
            >
                {avatarUrl ? <img src={avatarUrl} alt='avatar' style={{ width: 100, height: 100 }}/> : uploadButton}
            </Upload>
        );
    }
}

export default AvatarUpload;
