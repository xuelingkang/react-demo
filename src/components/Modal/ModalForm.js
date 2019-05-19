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

    componentDidMount() {
        const {record, handlers, modalType, columns} = this.props;
        const {prepareRecord, onSubmit, onCancel} = handlers;
        if (prepareRecord && prepareRecord[modalType]) {
            prepareRecord[modalType](record).then(result => {
                this.setState({
                    record: result
                });
            })
        }

        if (onSubmit && onSubmit[modalType]) {
            this.setState({
                onSubmit: onSubmit[modalType]
            });
        }

        if (onCancel && onCancel[modalType]) {
            this.setState({
                onCancel: onCancel[modalType]
            });
        } else if (onCancel && onCancel[modalType] !== false && onCancel['default']) {
            this.setState({
                onCancel: onCancel['default']
            });
        }

        const formColumns = columns.filter(col => col.formItem && col.formItem[modalType]).map(col => {
            return {
                ...col,
                formItem: {
                    ...col.formItem['default'],
                    ...col.formItem[modalType]
                }
            }
        });
        this.setState({formColumns});
    }

    closeModal = () => {
        const { onCancel } = this.state;
        if (onCancel) {
            onCancel();
            return;
        }
        this.setState({
            visible: false
        });
    };

    onSubmit = () => {
        const { record } = this.state;
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
            className,
            columns,
            modalType,
            modalOpts,
            formOpts,
            loading,
            full,
            preview
        } = this.props;

        const {record, onSubmit, onCancel, formColumns} = this.state;

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
