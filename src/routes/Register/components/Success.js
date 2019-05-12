import React, {Component, Fragment} from 'react';
import { Link } from 'dva/router';
import {Result} from 'components/Pages';
import {Layout, Button} from 'antd';

const {Content} = Layout;

export default class extends Component {
    render() {
        const actions = (
            <Fragment>
                <Button type='primary' href='/'>前往首页</Button>
            </Fragment>
        );

        const footer = (
            <Fragment>
                <p>
                    <a>Need More Help?</a>
                </p>
                <p>
                    Misc question two? <a>Response Link</a>
                </p>
            </Fragment>
        );

        const extra = <div>Yoursite.com</div>;

        return (
            <Layout className="full-layout result-page">
                <Content>
                    <Result
                        title="注册成功"
                        type="success"
                        actions={actions}
                        footer={footer}
                        extra={extra}
                    >
                        恭喜你，注册成功！
                    </Result>
                </Content>
            </Layout>
        );
    }
}
