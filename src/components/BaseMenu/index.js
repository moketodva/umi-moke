import { Menu } from 'antd';
import { Link } from 'umi';

const SubMenu = Menu.SubMenu;

export default ({ data }) => {
    const renderMenu = (data = []) => {
        return (
            data.map((item, index) => {
                if (item.children.length > 0) {
                    return <SubMenu title={item.name} key={item.absolutePath}>{renderMenu(item.children)}</SubMenu>;
                }
                return (
                    <Menu.Item key={item.absolutePath}>
                        <Link to={item.absolutePath}>{item.name}</Link>
                    </Menu.Item>
                );
            })
        );
    };

    return (
        <Menu>
            {renderMenu(data)}
        </Menu>
    );
};

