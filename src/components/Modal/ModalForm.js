import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'antd';
import Form from '../Form';
import cx from 'classnames';
import './style/index.less';

class ModalForm extends Component {
    static propTypes = {
        title: PropTypes.string,
        modalType: PropTypes.string,
        handlers: PropTypes.object,
        record: PropTypes.object,
        columns: PropTypes.array,
        modalOpts: PropTypes.object,
        formOpts: PropTypes.object,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible
        };
    }

    getOnSubmitFunc = () => {
        const {handlers, modalType} = this.props;
        const {onSubmit} = handlers;
        if (onSubmit && onSubmit[modalType]) {
            return onSubmit[modalType];
        }
    };

    getOnCancelFunc = () => {
        const {handlers, modalType} = this.props;
        const {onCancel} = handlers;
        if (onCancel && onCancel[modalType]) {
            return onCancel[modalType];
        } else if (onCancel && onCancel[modalType] !== false && onCancel['default']) {
            return onCancel['default'];
        }
    }

    getFormColumns = () => {
        const {modalType, columns} = this.props;
        return columns.filter(col => col.formItem && col.formItem[modalType]).map(col => {
            return {
                ...col,
                formItem: {
                    ...col.formItem['default'],
                    ...col.formItem[modalType]
                }
            }
        });
    }

    closeModal = () => {
        const onCancel = this.getOnCancelFunc();
        if (onCancel) {
            onCancel();
            return;
        }
        this.setState({
            visible: false
        });
    };

    onSubmit = () => {
        const { record } = this.props;
        this.refs.form.validateFields((error, value) => {
            if (error) {
                console.log(error);
                return;
            }
            const { onSubmit } = this.refs.form.props;
            onSubmit && onSubmit(value, record);
        });
    };

    render() {
        const {
            title,
            record,
            className,
            visible,
            modalOpts,
            formOpts,
            loading,
            full,
            preview
        } = this.props;

        const onSubmit = this.getOnSubmitFunc();
        const onCancel = this.getOnCancelFunc();
        const formColumns = this.getFormColumns();

        const classname = cx(className, 'antui-modalform', {'full-modal': full});
        const modalProps = {
            centered: true, // 垂直居中
            className: classname,
            visible,
            // style: {top: 20},
            title: title || (record ? '编辑' : '新增'),
            // maskClosable: true,
            destroyOnClose: true,
            onCancel: this.closeModal,
            footer: [
                onCancel && (
                    <Button key="back" onClick={this.closeModal}>
                        取消
                    </Button>
                ),
                onSubmit && (
                    <Button key="submit" type="primary" onClick={this.onSubmit} loading={loading}>
                        确定
                    </Button>
                )
            ],
            ...modalOpts
        };

        const formProps = {
            ref: 'form',
            columns: formColumns,
            onSubmit,
            record,
            loading,
            preview,
            footer: false,
            formItemLayout: {
                labelCol: {span: 4},
                wrapperCol: {span: 17}
            },
            ...formOpts
        };

        return (
            <Modal {...modalProps}>
                <Form {...formProps} />
            </Modal>
        );
    }
}

export default ModalForm;
