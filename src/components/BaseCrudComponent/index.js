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
     * @param {function} [prepareRecord] 预处理record的方法
     */
    openModal = async (modalType, modalTitle, record, prepareRecord) => {
        this.setState({
            modalType,
            modalTitle,
            record,
            visible: true
        });
        if (record && prepareRecord) {
            record = await prepareRecord(record);
            this.setState({
                record
            });
        }
    };

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
    };

    /**
     * 请求详细信息
     * @param record 当前记录
     * @returns {Promise<void>}
     */
    requestDetail = record => {
        const { modelNamespace, dispatch } = this.props;
        const {rowKey} = record;
        return dispatch({
            type: `${modelNamespace}/detail`,
            payload: {
                rowKey
            }
        });
    };

    /**
     * 保存
     * @param values 表单数据
     */
    submitSave = async values => {
        const { modelNamespace, dispatch } = this.props;
        await dispatch({
            type: `${modelNamespace}/save`,
            payload: {
                values,
                success: this.saveSuccess
            }
        });
    };

    saveSuccess = this.closeModel;

    /**
     * 更新
     * @param values 表单数据
     * @param record 原数据
     */
    submitUpdate = async (values, record) => {
        const { modelNamespace, dispatch } = this.props;
        await dispatch({
            type: `${modelNamespace}/update`,
            payload: {
                values,
                record,
                success: this.updateSuccess
            }
        });
    };

    updateSuccess = this.closeModel;

    /**
     * 删除
     * @param {object | array} record 表单记录, 批量删除时为数组
     * @param {function} [onDelete] 确认删除回调
     */
    delete = (record, onDelete) => {
        if (!record) return;
        if ($$.isArray(record) && !record.length) return;

        const content = `您是否要删除这${
            $$.isArray(record) ? record.length : ''
            }项？`;
        if (!onDelete) {
            onDelete = this.onDelete;
        }
        Modal.confirm({
            title: '注意',
            content,
            onOk: () => {
                onDelete($$.isArray(record) ? record : [record]);
            },
            onCancel() {
            }
        });
    };

    /**
     * 确认删除时触发
     * @param {array} records 要删除的记录
     */
    onDelete = records => {
        const { modelNamespace, dispatch } = this.props;
        const recordKeys = records.map(record => record.rowKey).join();
        dispatch({
            type: `${modelNamespace}/delete`,
            payload: {
                recordKeys,
                records,
                success: () => {
                    const { rows } = this.state;
                    // 如果操作成功，在已选择的行中，排除删除的行
                    this.setState({
                        rows: rows.filter(
                            item => !records.some(jtem => jtem.rowKey === item.rowKey)
                        )
                    });
                }
            }
        });
    };

    /**
     * 选中行
     */
    selectRow = (keys, rows) => this.setState({ rows });

    /**
     * 修改查询参数
     * @param values 查询参数
     */
    onSearch = values => {
        const { modelState } = this.props;
        const { pageInfo } = modelState;
        pageInfo.setParams(values);
        this.search();
    };

    /**
     * 翻页或切换页面大小时触发
     */
    jumpPage = ({current, size}) => {
        const { modelState } = this.props;
        const { pageInfo } = modelState;
        pageInfo.jumpPage(current, size);
        this.search();
    };

    /**
     * 查询列表数据
     */
    search = () => {
        const { dispatch, modelNamespace } = this.props;
        dispatch({
            type: `${modelNamespace}/search`
        });
    };

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
        if (effects.hasOwnProperty(key) && key.indexOf(`${namespace}/`)!==-1) {
            if (effects[key]) {
                return true;
            }
        }
    }
    return false;
};
