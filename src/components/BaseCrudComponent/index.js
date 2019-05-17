import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import $$ from 'cmn-utils';
import config from '@/config';

export default class extends React.Component {

    static propTypes = {
        // 分发前缀，子类重写，需要与model的namespace一致
        modelNamespace: PropTypes.string.isRequired,
        // 确认删除方法
        onDelete: PropTypes.func
    }

    /**
     * 在没有dispatch函数时，如果想要在组件内进行跳转可以用router进行跳转
     */
    static contextTypes = {
        router: PropTypes.object
    };

    state = {
        modalType: '',
        modalTitle: '',
        record: null,
        visible: false,
        rows: []
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
                this.props.onDelete({self: this, records: $$.isArray(record) ? record : [record]});
            },
            onCancel() {
            }
        });
    };

    /**
     * 选中行
     */
    selectRow = (keys, rows) => this.setState({ rows })

    /**
     * 点击查询时触发
     * @param values 查询参数
     */
    search = async values => {
        const { dispatch, modelNamespace, modelState } = this.props;
        const { pageInfo } = modelState;
        await pageInfo.setParams(values);
        dispatch({
            type: `${modelNamespace}/@change`,
            payload: {
                pageInfo
            }
        });
    }

    /**
     * 翻页或切换页面大小时触发
     */
    jumpPage = async ({current, size}) => {
        const { dispatch, modelNamespace, modelState } = this.props;
        const { pageInfo } = modelState;
        await pageInfo.jumpPage(current, size);
        dispatch({
            type: `${modelNamespace}/@change`,
            payload: {
                pageInfo
            }
        });
    }

}

/**
 * 判断当前namespace是否正在加载
 * @param {object} loading redux中的loading
 * @param {string} namespace 当前namespace
 * @returns {boolean} true-当前正在加载 false-当前没有在加载
 */
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

/**
 * 确认删除时触发
 * @param {object} self
 * @param {array} records
 */
export const onDelete = ({self, records}) => {
    const { rows } = self.state;
    const { modelNamespace, dispatch } = self.props;
    const rowKeys = rows.map(row => row.rowKey).join();
    dispatch({
        type: `${modelNamespace}/delete`,
        payload: {
            rowKeys,
            records,
            success: () => {
                // 如果操作成功，在已选择的行中，排除删除的行
                self.setState({
                    rows: rows.filter(
                        item => !records.some(jtem => jtem.rowKey === item.rowKey)
                    )
                });
            }
        }
    });
}
