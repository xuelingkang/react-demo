import React, {Component} from 'react';
import {Tree} from 'antd';
import omit from 'object.omit';
const {TreeNode} = Tree;

/**
 * 扩展antd的Tree组件
 */
export default class AutoExpandTree extends Component {

    state={
        expandeds: [],
        selecteds: []
    }

    expand = node => {
        const {expandeds} = this.state;
        const {expandable, eventKey} = node.props;
        if (expandable) {
            if (expandeds.includes(eventKey)) {
                this.setState({
                    expandeds: expandeds.filter(key => key!==eventKey)
                });
            } else {
                this.setState({
                    expandeds: expandeds.concat(eventKey)
                });
            }
        }
    }

    select = node => {
        const {selecteds} = this.state;
        const {multiple} = this.props;
        const {selectable, eventKey} = node.props;
        if (selectable) {
            if (selecteds.includes(eventKey)) {
                this.setState({
                    selecteds: selecteds.filter(key => key!==eventKey)
                });
            } else {
                if (selecteds.length===0 || multiple) {
                    this.setState({
                        selecteds: selecteds.concat(eventKey)
                    });
                } else {
                    this.setState({
                        selecteds: [eventKey]
                    });
                }
            }
        }
    }

    onSelect = (selectedKeys, {selected, selectedNodes, node, event}) => {
        // 调用默认方法
        this.expand(node);
        this.select(node);
        // 调用传入的方法
        const {selecteds} = this.state;
        const {onSelect} = this.props;
        const {selectable, eventKey} = node.props;
        if (selectable) {
            if (!selecteds.includes(eventKey)) {
                onSelect && onSelect(selectedKeys, {selected, selectedNodes, node, event});
            }
        }
    }

    onExpand = (expandedKeys, {expanded, node}) => {
        // 调用默认方法
        this.expand(node);
        // 调用传入的方法
        const {expandeds} = this.state;
        const {onExpand} = this.props;
        const {expandable, eventKey} = node.props;
        if (expandable) {
            if (!expandeds.includes(eventKey)) {
                onExpand && onExpand(expandedKeys, {expanded, node});
            }
        }
    }

    render() {
        const {expandeds, selecteds} = this.state;
        const {children, ...otherProps} = this.props;
        const props = omit(otherProps, ['onSelect', 'onExpand', 'expandedKeys', 'selectedKeys']);
        return (
            <Tree
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                expandedKeys={expandeds}
                selectedKeys={selecteds}
                {...props}
            >
                {children}
            </Tree>
        );
    }

}

AutoExpandTree.TreeNode = TreeNode;
