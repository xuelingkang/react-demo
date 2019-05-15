import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Popover,
  Progress,
  Layout
} from 'antd';
import './index.less';
import '../../Login/components/index.less';
import logoImg from 'assets/images/logo1.png';
import Success from './Success';
import {getAuth} from "@/utils/authentication"
const { Content } = Layout;

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

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit']
}))
@Form.create()
export default class Register extends Component {
  state = {};
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

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'register/submit',
          payload: values
        });
      }
    });
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
        help: '请输入密码！',
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;

    const {token, authorities} = getAuth();
    if (token && authorities) {
      return <Success />;
    }
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
                className="register-form-button"
                type="primary"
                htmlType="submit"
              >
                注册
              </Button>
              <Link className="fr" to="/sign/login">
                使用已有账户登录
              </Link>
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}
