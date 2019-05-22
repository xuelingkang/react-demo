import React, {Component} from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import Form from 'components/Form';

import createColumns from './columns';
import Panel from "components/Panel"
// import './index.less';
const { Content } = Layout;

@connect(({ userinfo, loading }) => ({
    userinfo,
    submitting: loading.effects['userinfo/update']
}))
export default class extends Component {



    render() {
        const columns = createColumns(this);
        const formProps = {
            columns
        };
        return (
            <Layout className="full-layout page">
                <Content>
                    <Form {...formProps} />
                </Content>
            </Layout>
        );
    }
}
