import React, {Component, Fragment} from 'react';
import { routerRedux } from 'dva/router';
import {Result} from 'components/Pages';
import {Layout, Button} from 'antd';
import {connect} from "dva"

const {Content} = Layout;

@connect(state => (state))
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftTime: 5,
            timerId: undefined
        }
    }
    componentDidMount() {
        const timerId = setInterval(() => {
            let leftTime = this.state.leftTime - 1;
            this.setState({leftTime: leftTime});
            if (leftTime===0) {
                clearInterval(timerId);
                this.props.dispatch(routerRedux.replace('/'));
            }
        }, 1000);
        this.setState({
            timerId
        });
    }
    handleClick = () => {
        clearInterval(this.state.timerId);
        this.props.dispatch(routerRedux.replace('/'));
    }
    render() {
        const actions = (
            <Fragment>
                <Button type='primary' onClick={this.handleClick}>立即跳转</Button>
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

        let {leftTime} = this.state;

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
                        恭喜你，注册成功！{leftTime}秒后自动跳转到首页。
                    </Result>
                </Content>
            </Layout>
        );
    }
}
