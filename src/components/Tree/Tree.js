import React, {Component} from 'react';
import {Tree} from 'antd';

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
        const {onExpand} = this.props;
        const {expandable, eventKey} = node.props;
        if (expandable) {
            if (expandeds.includes(eventKey)) {
                const newExpandeds = expandeds.filter(key => key!==eventKey);
                this.setState({
                    expandeds: newExpandeds
                });
                onExpand && onExpand(newExpandeds, {expanded: false, node});
            } else {
                const newExpandeds = expandeds.concat(eventKey);
                this.setState({
                    expandeds: newExpandeds
                });
                onExpand && onExpand(newExpandeds, {expanded: true, node});
            }
        }
    }

    select = (selectedNodes, node, event) => {
        const {selecteds} = this.state;
        const {multiple, onSelect} = this.props;
        const {selectable, eventKey} = node.props;
        if (selectable) {
            if (selecteds.includes(eventKey)) {
                const newSelecteds = selecteds.filter(key => key!==eventKey);
                this.setState({
                    selecteds: newSelecteds
                });
                onSelect && onSelect(newSelecteds, {selectedNodes, node, event, selected: false});
            } else {
                let newSelecteds;
                if (selecteds.length===0 || multiple) {
                    newSelecteds = selecteds.concat(eventKey);
                    this.setState({
                        selecteds: newSelecteds
                    });
                } else {
                    newSelecteds = [eventKey];
                    this.setState({
                        selecteds: newSelecteds
                    });
                }
                onSelect && onSelect(newSelecteds, {selectedNodes, node, event, selected: true});
            }
        }
    }

    onSelect = (selectedKeys, {selectedNodes, node, event}) => {
        this.expand(node);
        this.select(selectedNodes, node, event);
    }

    onExpand = (expandedKeys, {node}) => {
        this.expand(node);
    }

    render() {
        const {expandeds, selecteds} = this.state;
        const {children, ...otherProps} = this.props;
        return (
            <Tree
                {...otherProps}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                expandedKeys={expandeds}
                selectedKeys={selecteds}
            >
                {children}
            </Tree>
        );
    }

}

AutoExpandTree.TreeNode = Tree.TreeNode;
AutoExpandTree.DirectoryTree = Tree.DirectoryTree;
