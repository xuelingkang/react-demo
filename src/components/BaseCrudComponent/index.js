import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import $$ from 'cmn-utils';
import config from '@/config';

export default class extends React.Component {

    modelNamespace = undefined; // 分发前缀，子类重写，需要与model的namespace一致

    state = {
        modalType: '',
        modalTitle: '',
        record: null,
        visible: false,
        rows: []
    };

    /**
     * 在没有dispatch函数时，如果想要在组件内进行跳转可以用router进行跳转
     */
    static contextTypes = {
        router: PropTypes.object
    };

    notice = config.notice; // 消息通知

    /**
     * 打开模态框
     * @param {string} modalType 模态框类型
     * @param {string} modalTitle 模态框标题
     * @param {object} [record] 要操作的记录
     */
    openModal = (modalType, modalTitle, record) => {
        this.setState({
            modalType,
            modalTitle,
            record,
            visible: true
        });
    }

    /**
     * 关闭模态框
     */
    closeModel = () => {
        this.setState({
            modalType: '',
            modalTitle: '',
            record: null,
            visible: false
        });
    }

    /**
     * 删除
     * @param {object | array} record 表单记录, 批量删除时为数组
     */
    delete = record => {
        if (!record) return;
        if ($$.isArray(record) && !record.length) return;

        const content = `您是否要删除这${
            $$.isArray(record) ? record.length : ''
            }项？`;

        Modal.confirm({
            title: '注意',
            content,
            onOk: () => {
                this.onDelete($$.isArray(record) ? record : [record]);
            },
            onCancel() {
            }
        });
    };

    /**
     * 确认删除
     */
    onDelete(records) {
        /* 子类重写 */
    }

    /**
     * 选中行
     */
    selectRow = (keys, rows) => this.setState({ rows })

    /**
     * 点击查询时触发
     * @param values 查询参数
     */
    search = async values => {
        const { dispatch } = this.props;
        const pageInfo = this.props.modelState.pageInfo;
        await pageInfo.setParams(values);
        dispatch({
            type: `${this.modelNamespace}/@change`,
            payload: {
                pageInfo
            }
        });
    }

    /**
     * 翻页或切换页面大小时触发
     */
    jumpPage = async ({current, size}) => {
        const { dispatch } = this.props;
        const pageInfo = this.props.modelState.pageInfo;
        await pageInfo.jumpPage(current, size);
        dispatch({
            type: `${this.modelNamespace}/@change`,
            payload: {
                pageInfo
            }
        });
    }

}

export const isLoading = (loading, namespace) => {
    const { models, effects } = loading;
    if (models[namespace]) {
        return true;
    }
    for (let key in effects) {
        if (effects.hasOwnProperty(key) && key.indexOf(namespace)!==-1) {
            if (effects[key]) {
                return true;
            }
        }
    }
    return false;
}
