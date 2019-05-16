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
        visible: PropTypes.bool,
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

    componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible
            });
        }
    }

    closeModal = () => {
        const { modalType, handlers } = this.props;
        const { onCancel } = handlers;
        let onCancelFunc = undefined;
        if (onCancel && onCancel[modalType]) {
            onCancelFunc = onCancel[modalType];
        } else if (onCancel && onCancel[modalType]!==false && onCancel['default']) {
            onCancelFunc = onCancel['default'];
        }
        if (onCancelFunc) {
            onCancelFunc();
            return;
        }
        this.setState({
            visible: false
        });
    };

    onSubmit = () => {
        const { modalType, record, handlers } = this.props;
        const { onSubmit } = handlers;
        let onSubmitFunc = undefined;
        if (onSubmit && onSubmit[modalType]) {
            onSubmitFunc = onSubmit[modalType];
        }
        this.refs.form.validateFields((error, value) => {
            if (error) {
                console.log(error);
                return;
            }
            onSubmitFunc && onSubmitFunc(value, record);
        });
    };

    render() {
        const {
            title,
            modalType,
            handlers,
            className,
            columns,
            modalOpts,
            formOpts,
            loading,
            full,
            preview
        } = this.props;

        let {record} = this.props;
        const { prevHandleRecord } = handlers;
        if (prevHandleRecord && prevHandleRecord[modalType]) {
            record = prevHandleRecord[modalType](record);
        }

        let onCancelFunc = undefined;
        const { onCancel } = handlers;
        if (onCancel && onCancel[modalType]) {
            onCancelFunc = onCancel[modalType];
        } else if (onCancel && onCancel[modalType]!==false && onCancel['default']) {
            onCancelFunc = onCancel['default'];
        }

        let onSubmitFunc = undefined;
        const { onSubmit } = handlers;
        if (onSubmit && onSubmit[modalType]) {
            onSubmitFunc = onSubmit[modalType];
        }

        const classname = cx(className, 'antui-modalform', {'full-modal': full});
        const modalProps = {
            wrapClassName: "vertical-center-modal",
            className: classname,
            visible: this.state.visible,
            style: {top: 20},
            title: title || (record ? '编辑' : '新增'),
            // maskClosable: true,
            destroyOnClose: true,
            onCancel: this.closeModal,
            footer: [
                onCancelFunc && (
                    <Button key="back" onClick={this.closeModal}>
                        取消
                    </Button>
                ),
                onSubmitFunc && (
                    <Button key="submit" type="primary" onClick={this.onSubmit} loading={loading}>
                        确定
                    </Button>
                )
            ],
            ...modalOpts
        };

        const formProps = {
            ref: 'form',
            columns,
            onSubmit: onSubmitFunc,
            record,
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
