import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import $$ from 'cmn-utils';
import config from '@/config';

export default class extends React.Component {

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

    onDelete(records) {
        /* 子类重写 */
    }

}
