import React from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Layout, Col, Row} from 'antd';
import BaseCrudComponent, {isLoading} from 'components/BaseCrudComponent';
import Panel from 'components/Panel';
import G2 from 'components/Charts/G2';
import DataSet from '@antv/data-set';
import { modelNamespace } from '../constant';
import './index.less';

const {Content} = Layout;
const {Chart, Axis, Geom, Tooltip, Legend, Coord, Label} = G2;

@connect(({ [modelNamespace]: modelState, loading }) => ({
    modelNamespace,
    modelState,
    loading: isLoading(loading, modelNamespace)
}))
export default class Dashboard extends BaseCrudComponent {
    render() {
        const {modelState} = this.props;
        const {broadcastMonth, mailMonth, broadcastSendUser, mailSendUser, userSex, bar1, bar2} = modelState;
        return (
            <Layout className="full-layout page dashboard-page">
                <Content>
                    <Row>
                        <Col>
                            <Panel title="近一个月广播统计" height={300}>
                                <BroadcastMonth data={broadcastMonth} />
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Panel title="近一个月邮件统计" height={300}>
                                <MailMonth data={mailMonth} />
                            </Panel>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col md={8}>
                            <Panel title="折线图" height={260}>
                                <Line1/>
                            </Panel>
                        </Col>
                        <Col md={8}>
                            <Panel title="饼图" height={260}>
                                <Pie1/>
                            </Panel>
                        </Col>
                        <Col md={8}>
                            <Panel title="柱状图" height={260}>
                                <Bar1 data={bar1}/>
                            </Panel>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}

// source https://alibaba.github.io/BizCharts/demo-detail.html?code=demo/bar/basic-column
const Bar1 = props => {
    return (
        <Chart data={props.data} scale={{sales: {tickInterval: 20}}}>
            <Axis name="year"/>
            <Axis name="sales"/>
            <Tooltip crosshairs={{type: 'y'}}/>
            <Geom
                type="interval"
                position="year*sales"
                color={[
                    'year',
                    ['#3da0ff', '#51ca73', '#fad337', '#424e87', '#985ce6']
                ]}
            />
        </Chart>
    );
};

const Pie1 = props => {
    const data = [
        {item: '事例一', count: 40},
        {item: '事例二', count: 21},
        {item: '事例三', count: 17},
        {item: '事例四', count: 13},
        {item: '事例五', count: 9}
    ];

    const dv = new DataSet.DataView();
    dv.source(data).transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
    });
    const cols = {
        percent: {
            formatter: val => {
                val = val * 100 + '%';
                return val;
            }
        }
    };
    return (
        <Chart data={dv} scale={cols} padding={10}>
            <Coord type={'theta'} radius={0.75} innerRadius={0.6}/>
            <Axis name="percent"/>
            <Legend
                position="right"
                offsetY={-window.innerHeight / 2 + 120}
                offsetX={-100}
            />
            <Tooltip
                showTitle={false}
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
                type="intervalStack"
                position="percent"
                color="item"
                tooltip={[
                    'item*percent',
                    (item, percent) => {
                        percent = percent * 100 + '%';
                        return {
                            name: item,
                            value: percent
                        };
                    }
                ]}
                style={{lineWidth: 1, stroke: '#fff'}}
            >
                <Label
                    content="percent"
                    formatter={(val, item) => {
                        return item.point.item + ': ' + val;
                    }}
                />
            </Geom>
        </Chart>
    );
};

// https://alibaba.github.io/BizCharts/demo-detail.html?code=demo/line/series
const Line1 = props => {
    const data = [
        {month: 'Jan', Tokyo: 7.0, London: 3.9},
        {month: 'Feb', Tokyo: 6.9, London: 4.2},
        {month: 'Mar', Tokyo: 9.5, London: 5.7},
        {month: 'Apr', Tokyo: 14.5, London: 8.5},
        {month: 'May', Tokyo: 18.4, London: 11.9},
        {month: 'Jun', Tokyo: 21.5, London: 15.2},
        {month: 'Jul', Tokyo: 25.2, London: 17.0},
        {month: 'Aug', Tokyo: 26.5, London: 16.6},
        {month: 'Sep', Tokyo: 23.3, London: 14.2},
        {month: 'Oct', Tokyo: 18.3, London: 10.3},
        {month: 'Nov', Tokyo: 13.9, London: 6.6},
        {month: 'Dec', Tokyo: 9.6, London: 4.8}
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'fold',
        fields: ['Tokyo', 'London'], // 展开字段集
        key: 'city', // key字段
        value: 'temperature' // value字段
    });

    const cols = {
        month: {
            range: [0, 1]
        }
    };
    return (
        <Chart data={dv} scale={cols}>
            <Legend/>
            <Axis name="month"/>
            <Axis name="temperature" label={{formatter: val => `${val}°C`}}/>
            <Tooltip crosshairs={{type: 'y'}}/>
            <Geom type="line" position="month*temperature" size={2} color={'city'}/>
            <Geom
                type="point"
                position="month*temperature"
                size={4}
                shape={'circle'}
                color={'city'}
                style={{stroke: '#fff', lineWidth: 1}}
            />
        </Chart>
    );
};

const BroadcastMonth = props => {
    const data = props.data.map(({name, value}) => ({
        date: moment(parseInt(name)).format('YYYY-MM-DD'),
        count: parseInt(value)
    }));
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'fold',
        fields: ['count'], // 展开字段集
        key: 'time', // key字段
        value: 'summary' // value字段
    });

    const cols = {
        date: {
            range: [0, 1]
        }
    };
    return (
        <Chart data={dv} scale={cols}>
            <Legend/>
            <Axis name="date" />
            <Axis name="summary" />
            <Tooltip crosshairs={{type: 'y'}} />
            <Geom type="line" position="date*summary" size={2} color={'time'} />
            <Geom
                type="point"
                position="date*summary"
                size={4}
                shape={'circle'}
                color={'time'}
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
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'fold',
        fields: ['count'], // 展开字段集
        key: 'time', // key字段
        value: 'summary' // value字段
    });

    const cols = {
        date: {
            range: [0, 1]
        }
    };
    return (
        <Chart data={dv} scale={cols}>
            <Legend/>
            <Axis name="date" />
            <Axis name="summary" />
            <Tooltip crosshairs={{type: 'y'}} />
            <Geom type="line" position="date*summary" size={2} color={'time'} />
            <Geom
                type="point"
                position="date*summary"
                size={4}
                shape={'circle'}
                color={'time'}
                style={{stroke: '#fff', lineWidth: 1}}
            />
        </Chart>
    );
};
