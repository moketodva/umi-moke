import { Spin } from 'antd';

export default ({ spinning = false, children }) => (
    <Spin spinning={spinning}>
        {children}
    </Spin>
);

