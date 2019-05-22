import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Button,
    Layout
} from 'antd';
import './index.less';
import logoImg from 'assets/images/logo1.png';
const { Content } = Layout;

const FormItem = Form.Item;

@connect(({ userinfo, loading }) => ({
    userinfo,
    submitting: loading.effects['userinfo/update']
}))
@Form.create()
export default class Register extends Component {
    state = {};

    handleSubmit = e => {
        e.preventDefault();
        const { form, dispatch } = this.props;
        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                dispatch({
                    type: 'userinfo/update',
                    payload: values
                });
            }
        });
    };

    render() {
        const { form, submitting } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Layout className="full-layout register-page login-page">
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
                                    },
                                    {
                                        pattern: /^\w{5,20}$/,
                                        message: '用户名最少5位，最多20位！'
                                    }
                                ]
                            })(<Input size="large" placeholder="用户名" />)}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入邮箱！'
                                    },
                                    {
                                        type: 'email',
                                        message: '邮箱地址格式错误！'
                                    }
                                ]
                            })(<Input size="large" placeholder="邮箱" />)}
                        </FormItem>
                        <FormItem>
                            <Button
                                size="large"
                                loading={submitting}
                                type="primary"
                                htmlType="submit"
                            >
                                提交
                            </Button>
                        </FormItem>
                    </Form>
                </Content>
            </Layout>
        );
    }
}
