import React from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Layout, Col, Row} from 'antd';
import BaseCrudComponent, {isLoading} from 'components/BaseCrudComponent';
import Panel from 'components/Panel';
import G2 from 'components/Charts/G2';
import DataSet from '@antv/data-set';
import { modelNamespace } from '../constant';
import CheckResource from '@/utils/checkResource';
import './index.less';

const {Content} = Layout;
const {Chart, Axis, Geom, Tooltip, Legend, Coord, Label, Guide} = G2;
const {Html} = Guide;

@connect(({ [modelNamespace]: modelState, loading }) => ({
    modelNamespace,
    modelState,
    loading: isLoading(loading, modelNamespace)
}))
export default class Dashboard extends BaseCrudComponent {
    render() {
        const {modelState} = this.props;
        const {broadcastMonth, mailMonth, broadcastSendUser, mailSendUser, userSex} = modelState;
        return (
            <Layout className="full-layout page dashboard-page">
                <Content>
                    <CheckResource
                        resource='http./summary/broadcast/month.GET'
                        component={
                        <Row>
                            <Col>
                                <Panel title="近一个月广播统计" height={300}>
                                    <BroadcastMonth data={broadcastMonth} />
                                </Panel>
                            </Col>
                        </Row>
                    } />
                    <CheckResource
                        resource='http./summary/mail/month.GET'
                        component={
                            <Row>
                                <Col>
                                    <Panel title="近一个月邮件统计" height={300}>
                                        <MailMonth data={mailMonth} />
                                    </Panel>
                                </Col>
                            </Row>
                        }
                    />
                    <Row gutter={20}>
                        <CheckResource
                            resource='http./summary/broadcast/senduser.GET'
                            component={
                                <Col md={8}>
                                    <Panel title="用户广播占比" height={260}>
                                        <BroadcastSendUser data={broadcastSendUser} />
                                    </Panel>
                                </Col>
                            }
                        />
                        <CheckResource
                            resource='http./summary/broadcast/senduser.GET'
                            component={
                                <Col md={8}>
                                    <Panel title="用户邮件占比" height={260}>
                                        <MailSendUser data={mailSendUser} />
                                    </Panel>
                                </Col>
                            }
                        />
                        <CheckResource
                            resource='http./summary/broadcast/senduser.GET'
                            component={
                                <Col md={8}>
                                    <Panel title="用户性别占比" height={260}>
                                        <UserSex data={userSex} />
                                    </Panel>
                                </Col>
                            }
                        />
                    </Row>
                </Content>
            </Layout>
        );
    }
}

const BroadcastMonth = props => {
    const data = props.data.map(({name, value}) => ({
        date: moment(parseInt(name)).format('YYYY-MM-DD'),
        count: parseInt(value)
    }));
    const cols = {
        date: {
            range: [0, 1]
        },
        count: {
            min: 0
        }
    };
    return (
        <Chart data={data} scale={cols}>
            <Legend/>
            <Axis name="date" />
            <Axis name="count" />
            <Tooltip crosshairs={{type: 'y'}} />
            <Geom type="line" position="date*count" size={2} />
            <Geom
                type="point"
                position="date*count"
                size={4}
                shape={'circle'}
                style={{stroke: '#fff', lineWidth: 1}}
            />
        </Chart>
    );
};

const MailMonth = props => {
    const data = props.data.map(({name, value}) => ({
        date: moment(parseInt(name)).format('YYYY-MM-DD'),
        count: parseInt(value)
    }));
    const cols = {
        date: {
            range: [0, 1]
        },
        count: {
            min: 0
        }
    };
    return (
        <Chart data={data} scale={cols}>
            <Legend/>
            <Axis name="date" />
            <Axis name="count" />
            <Tooltip crosshairs={{type: 'y'}} />
            <Geom type="line" position="date*count" size={2} />
            <Geom
                type="point"
                position="date*count"
                size={4}
                shape={'circle'}
                style={{stroke: '#fff', lineWidth: 1}}
            />
        </Chart>
    );
};

const BroadcastSendUser = props => {
    const data = props.data.map(({name, value}) => ({
        name,
        count: parseInt(value)
    }));
    let total = 0;
    data.forEach(({count}) => total+=count);
    const guideHtml = `
            <div style='color:#8c8c8c;text-align:center;'>
                广播<br>
                <span style='color:#262626;'>${total}</span>条
            </div>`;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'name',
        as: 'percent'
    });
    const cols = {
        percent: {
            formatter: val => {
                val = Math.round(val * 100) + '%';
                return val;
            }
        }
    };
    return (
        <Chart data={dv} scale={cols} padding={10}>
            <Coord type={'theta'} radius={0.75} innerRadius={0.6}/>
            <Axis name="percent" />
            <Legend
                position="right"
                offsetY={-window.innerHeight / 2 + 120}
                offsetX={-100}
            />
            <Tooltip
                showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            />
            <Guide>
                <Html
                    position={["50%", "50%"]}
                    html={guideHtml}
                    alignX="middle"
                    alignY="middle"
                />
            </Guide>
            <Geom
                type="intervalStack"
                position="percent"
                color="name"
                tooltip={[
                    'name*percent',
                    (name, percent) => {
                        percent = Math.round(percent * 100) + '%';
                        return {
                            name,
                            value: percent
                        };
                    }
                ]}
                style={{lineWidth: 1, stroke: '#fff'}}
            >
                <Label
                    content="percent"
                    formatter={(val, item) => {
                        return item.point.name + ': ' + val;
                    }}
                />
            </Geom>
        </Chart>
    );
};

const MailSendUser = props => {
    const data = props.data.map(({name, value}) => ({
        name: name? name: '后台',
        count: parseInt(value)
    }));
    let total = 0;
    data.forEach(({count}) => total+=count);
    const guideHtml = `
            <div style='color:#8c8c8c;text-align:center;'>
                邮件<br>
                <span style='color:#262626;'>${total}</span>条
            </div>`;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'name',
        as: 'percent'
    });
    const cols = {
        percent: {
            formatter: val => {
                val = Math.round(val * 100) + '%';
                return val;
            }
        }
    };
    return (
        <Chart data={dv} scale={cols} padding={10}>
            <Coord type={'theta'} radius={0.75} innerRadius={0.6}/>
            <Axis name='percent' />
            <Legend
                position='right'
                offsetY={-window.innerHeight / 2 + 120}
                offsetX={-100}
            />
            <Tooltip
                showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            />
            <Guide>
                <Html
                    position={['50%', '50%']}
                    html={guideHtml}
                    alignX='middle'
                    alignY='middle'
                />
            </Guide>
            <Geom
                type='intervalStack'
                position='percent'
                color='name'
                tooltip={[
                    'name*percent',
                    (name, percent) => {
                        percent = Math.round(percent * 100) + '%';
                        return {
                            name,
                            value: percent
                        };
                    }
                ]}
                style={{lineWidth: 1, stroke: '#fff'}}
            >
                <Label
                    content='percent'
                    formatter={(val, item) => {
                        return item.point.name + ': ' + val;
                    }}
                />
            </Geom>
        </Chart>
    );
};

const UserSex = props => {
    const data = props.data.map(({name, value}) => ({
        sex: name==='1'? '男': name==='0'? '女': '未知',
        count: parseInt(value)
    }));
    let total = 0;
    data.forEach(({count}) => total+=count);
    const guideHtml = `
            <div style='color:#8c8c8c;text-align:center;'>
                用户<br>
                <span style='color:#262626;'>${total}</span>个
            </div>`;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'sex',
        as: 'percent'
    });
    const cols = {
        percent: {
            formatter: val => {
                val = Math.round(val * 100) + '%';
                return val;
            }
        }
    };
    return (
        <Chart data={dv} scale={cols} padding={10}>
            <Coord type={'theta'} radius={0.75} innerRadius={0.6}/>
            <Axis name='percent' />
            <Legend
                position='right'
                offsetY={-window.innerHeight / 2 + 120}
                offsetX={-100}
            />
            <Tooltip
                showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{sex}: {value}</li>'
            />
            <Guide>
                <Html
                    position={['50%', '50%']}
                    html={guideHtml}
                    alignX='middle'
                    alignY='middle'
                />
            </Guide>
            <Geom
                type='intervalStack'
                position='percent'
                color='sex'
                tooltip={[
                    'sex*percent',
                    (sex, percent) => {
                        percent = Math.round(percent * 100) + '%';
                        return {
                            sex,
                            value: percent
                        };
                    }
                ]}
                style={{lineWidth: 1, stroke: '#fff'}}
            >
                <Label
                    content='percent'
                    formatter={(val, item) => {
                        return item.point.sex + ': ' + val;
                    }}
                />
            </Geom>
        </Chart>
    );
};
