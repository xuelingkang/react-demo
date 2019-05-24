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
            const {id, deptName, subs, users} = item;

            return (
                <TreeNode key={`dept_${id}`} title={deptName} dataRef={item} expandable={true}
                          icon={<Icon type='lines'/>}>
                    {users ? users.map(user => {
                        const {id, nickname, sex, headImg = {}} = user;
                        let iconComp;
                        if (headImg) {
                            const {attachmentAddress} = headImg;
                            const avatarStyle = {maxWidth: '100%', maxHeight: '100%'};
                            iconComp = <Avatar src={attachmentAddress} style={avatarStyle}>{nickname}</Avatar>;
                        } else {
                            const iconType = sex===0? 'woman': 'man';
                            iconComp = <Icon type={iconType} />;
                        }
                        return (
                            <TreeNode
                                key={`user_${id}`}
                                title={nickname}
                                dataRef={user}
                                selectable={true}
                                icon={iconComp}
                            />
                        );
                    }) : null}
                    {subs ? this.renderTreeNodes(subs) : null}
                </TreeNode>
            );
        });
    };

    // 选中时回调，参数selectedKeys, {selected, selectedNodes, node, event}
    onSelectTreeNode = (selectedKeys, {selected, node}) => {
        if (selected) {
            const {dataRef} = node.props;
            console.log(dataRef);
        }
    }

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
                    <Tree showIcon={true} onSelect={this.onSelectTreeNode}>
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
