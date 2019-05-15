import React, {Component} from 'react';
import {connect} from 'dva';
import {Form, Layout, Button, Input, Popover, Progress} from 'antd';
import { normal } from 'components/Notification';
import Success from './Success';
import logoImg from 'assets/images/logo1.png';
import '../../Login/components/index.less';

const notice = normal;
const {Content} = Layout;
const FormItem = Form.Item;

const passwordStatusMap = {
    ok: <div style={{ color: '#52c41a' }}>强度：强</div>,
    pass: <div style={{ color: '#faad14' }}>强度：中</div>,
    poor: <div style={{ color: '#f5222d' }}>强度：太短</div>
};

const passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception'
};

@connect(({retrievePassword}) => ({
    retrievePassword
}))
@Form.create()
export default class RetrievePassword extends Component {
    state = {
        sendEmailLoading: false,
        sendEmailTimerId: undefined,
        sendEmailTimeout: undefined,
        sendEmailText: '发送邮件验证码'
    };

    getPasswordStatus = () => {
        const { form } = this.props;
        const value = form.getFieldValue('password');
        if (value && value.length > 9) {
            return 'ok';
        }
        if (value && value.length > 5) {
            return 'pass';
        }
        return 'poor';
    };

    checkConfirm = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不匹配!');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            this.setState({
                help: '请输入新密码！',
                visible: !!value
            });
            callback('error');
        } else {
            this.setState({
                help: ''
            });
            const { visible, confirmDirty } = this.state;
            if (!visible) {
                this.setState({
                    visible: !!value
                });
            }
            if (value.length < 6) {
                callback('error');
            } else {
                const { form } = this.props;
                if (value && confirmDirty) {
                    form.validateFields(['confirm'], { force: true });
                }
                callback();
            }
        }
    };

    renderPasswordProgress = () => {
        const { form } = this.props;
        const value = form.getFieldValue('password');
        const passwordStatus = this.getPasswordStatus();
        return value && value.length ? (
            <Progress
                status={passwordProgressMap[passwordStatus]}
                className={`progress-${passwordStatus}`}
                strokeWidth={6}
                percent={value.length * 10 > 100 ? 100 : value.length * 10}
                showInfo={false}
            />
        ) : null;
    };

    handleSendEmail = () => {
        const {form, dispatch} = this.props;
        let username = form.getFieldValue('username');
        if (username) {
            username = username.trim();
        }
        if (username===null || username===undefined || !/^\w+$/.test(username)) {
            notice.error('用户名不能为空');
            return;
        }
        dispatch({
            type: 'retrievePassword/email',
            payload: {username}
        });
        const sendEmailTimerId = setInterval(() => {
            let sendEmailTimeout = this.state.sendEmailTimeout;
            sendEmailTimeout--;
            if (sendEmailTimeout>0) {
                this.setState({
                    sendEmailLoading: true,
                    sendEmailTimeout,
                    sendEmailText: `${this.state.sendEmailTimeout}秒后可重新发送`
                });
            } else {
                clearInterval(sendEmailTimerId);
                this.setState({
                    sendEmailLoading: false,
                    sendEmailTimeout: 0,
                    sendEmailText: '重新发送验证码'
                });
            }
        }, 1000);
        this.setState({
            sendEmailTimerId,
            sendEmailTimeout: 60
        });
    };

    componentWillUnmount = () => {
        clearInterval(this.state.sendEmailTimerId);
    }

    handleSubmit = e => {
        e.preventDefault();
        const { form, dispatch } = this.props;
        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                dispatch({
                    type: 'retrievePassword/modPwd',
                    payload: values
                });
            }
        });
    };

    render() {
        const {retrievePassword, form} = this.props;
        const {modPwdStatus} = retrievePassword;
        const {getFieldDecorator} = form;
        const { help, visible } = this.state;
        if (modPwdStatus) {
            return <Success />
        }
        return (
            <Layout className="full-layout login-page">
                <Content>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="user-img">
                            <img src={logoImg} alt="logo" />
                            <b>REACT</b>
                            <span>中后台</span>
                        </div>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入用户名！'
                                    }
                                ]
                            })(<Input size="large" placeholder="用户名" />)}
                        </FormItem>
                        <FormItem>
                            <Button
                                size="large"
                                className="login-form-button"
                                onClick={this.handleSendEmail}
                                loading={this.state.sendEmailLoading}
                            >
                                {this.state.sendEmailText}
                            </Button>
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('verification', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入验证码！'
                                    }
                                ]
                            })(<Input size="large" placeholder="验证码" />)}
                        </FormItem>
                        <FormItem help={help}>
                            <Popover
                                content={
                                    <div style={{ padding: '4px 0' }}>
                                        {passwordStatusMap[this.getPasswordStatus()]}
                                        {this.renderPasswordProgress()}
                                        <div style={{ marginTop: 10 }}>
                                            请至少输入 6 个字符。请不要使用容易被猜到的密码。
                                        </div>
                                    </div>
                                }
                                overlayStyle={{ width: 240 }}
                                placement="right"
                                visible={visible}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.checkPassword
                                        }
                                    ]
                                })(
                                    <Input
                                        size="large"
                                        type="password"
                                        placeholder="至少6位密码，区分大小写"
                                    />
                                )}
                            </Popover>
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请确认密码！'
                                    },
                                    {
                                        validator: this.checkConfirm
                                    }
                                ]
                            })(<Input size="large" type="password" placeholder="确认密码" />)}
                        </FormItem>
                        <FormItem>
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                修改密码
                            </Button>
                        </FormItem>
                    </Form>
                </Content>
            </Layout>
        );
    }
}
