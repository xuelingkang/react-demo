import React, {Component} from 'react';
import cx from 'classnames';
import {Layout, Drawer, Avatar} from 'antd';
import Tree from 'components/Tree';
import Icon from 'components/Icon';
import './style/index.less';

const {Sider} = Layout;
const {TreeNode} = Tree;

class RightSideBar extends Component {

    static defaultProps = {
        fixed: true,
        theme: ''
    };

    renderTreeNodes = data => {
        return data.map(item => {
            const {subs, users} = item;

            return (
                <TreeNode icon={<Icon type='lines'/>} title={item.deptName} key={`dept_${item.id}`} expandable={true}>
                    {users ?
                        users.map(({headImg, nickname, id}) =>
                            <TreeNode
                                key={`user_${id}`}
                                title={nickname}
                                selectable={true}
                                icon={headImg ?
                                    <Avatar src={headImg.attachmentAddress} style={{width: '24px', height: '24px'}}/> :
                                    <Icon type='user'/>}
                            />)
                        : null}
                    {subs ? this.renderTreeNodes(subs) : null}
                </TreeNode>
            );
        });
    };

    render() {
        const {fixed, theme, collapsed, isMobile, onCollapse, structure} = this.props;

        const classnames = cx('sidebar-left', {
            affix: !!fixed,
            'sidebar-right-close': collapsed,
            [theme]: !!theme
        });

        const siderBar = (
            <Sider
                className={classnames}
                width={300}
                collapsedWidth={0}
                collapsible
                collapsed={collapsed}
                trigger={null}
            >
                <div className="sidebar-right-content">
                    <Tree showIcon={true} onSelect={(selectedKeys, {selected, selectedNodes, node, event}) => {
                        console.log(selectedKeys);
                        console.log(selected);
                        console.log(selectedNodes);
                        console.log(node);
                        console.log(event);
                    }}
                    onExpand={(expandedKeys, {expanded, node}) => {
                        console.log(expandedKeys);
                        console.log(expanded);
                        console.log(node);
                    }}>
                        {this.renderTreeNodes(structure)}
                    </Tree>
                </div>
            </Sider>
        );

        return isMobile ? (
            <Drawer
                className=""
                onClose={onCollapse}
                visible={!collapsed}
                placement="right"
                width={300}
            >
                {siderBar}
            </Drawer>
        ) : (
            siderBar
        );
    }
}

export default RightSideBar;
