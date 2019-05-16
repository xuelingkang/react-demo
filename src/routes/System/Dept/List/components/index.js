import React from 'react';
import { connect } from 'dva';
import { Layout, Button } from 'antd';
import BaseCrudComponent from 'components/BaseCrudComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import './index.less';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ deptlist, loading }) => ({
    deptlist,
    loading: loading.models.deptlist
}))
export default class extends BaseCrudComponent {
    state = {
        modalType: '',
        modalTitle: '',
        record: null,
        visible: false,
        rows: []
    };

    // TODO 这一部分提取到父类
    modalHandlers = {
        prevHandleRecord: {
            update: record => {
                console.log(record);
                return record;
            }
        },
        onSubmit: {
            save: (values, record) => {
                this.props.dispatch({
                    type: 'deptlist/save',
                    payload: {
                        values,
                        record,
                        success: this.modalHandlers.onCancel.default
                    }
                });
            },
            update: (values, record) => {
                this.props.dispatch({
                    type: 'deptlist/update',
                    payload: {
                        values,
                        record,
                        success: this.modalHandlers.onCancel.default
                    }
                });
            }
        },
        onCancel: {
            save: false,
            default: () => {
                this.setState({
                    modalType: '',
                    modalTitle: '',
                    record: null,
                    visible: false
                });
            }
        }
    };

    onDelete = records => {
        const { rows } = this.state;

        this.props.dispatch({
            type: 'deptlist/delete',
            payload: {
                records,
                success: () => {
                    // 如果操作成功，在已选择的行中，排除删除的行
                    this.setState({
                        rows: rows.filter(
                            item => !records.some(jtem => jtem.rowKey === item.rowKey)
                        )
                    });
                }
            }
        });
    }

    render() {
        const { deptlist, loading, dispatch } = this.props;
        const { pageInfo, allDepts } = deptlist;
        const columns = createColumns(this, allDepts);
        const { modalType, modalTitle, rows, record, visible } = this.state;

        const searchBarProps = {
            columns,
            onSearch: values => {
                dispatch({
                    type: 'deptlist/getPageInfo',
                    payload: {
                        pageInfo: pageInfo.setParams(values)
                    }
                });
            }
        };

        const dataTableProps = {
            loading,
            columns,
            pageInfo,
            rowKey: 'id',
            selectType: 'checkbox',
            isScroll: true,
            selectedRowKeys: rows.map(item => item.rowKey),
            onChange: ({ current, size }) => {
                dispatch({
                    type: 'deptlist/getPageInfo',
                    payload: {
                        pageInfo: pageInfo.jumpPage(current, size)
                    }
                });
            },
            onSelect: (keys, rows) => this.setState({ rows })
        };

        const modalFormProps = {
            title: `${modalTitle}`,
            modalType,
            loading,
            record,
            visible,
            columns,
            modalOpts: {
                width: 700
            },
            handlers: this.modalHandlers
        };

        return (
            <Layout className="full-layout crud-page">
                <Header>
                    <Toolbar
                        appendLeft={
                            <Button.Group>
                                <Button type="primary" icon="plus"
                                        onClick={() => this.openModal('save', '保存部门')}>
                                    新增
                                </Button>
                                <Button
                                    disabled={!rows.length}
                                    onClick={e => this.delete(rows)}
                                    icon="delete"
                                >
                                    删除
                                </Button>
                            </Button.Group>
                        }
                        pullDown={<SearchBar type="grid" {...searchBarProps} />}
                    >
                        <SearchBar group="abc" {...searchBarProps} />
                    </Toolbar>
                </Header>
                <Content>
                    <DataTable {...dataTableProps} />
                </Content>
                <Footer>
                    <Pagination {...dataTableProps} />
                </Footer>
                <ModalForm {...modalFormProps} />
            </Layout>
        );
    }
}
