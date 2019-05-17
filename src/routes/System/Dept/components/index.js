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

@connect(({ dept, loading }) => ({
    dept,
    loading: loading.models.dept
}))
export default class extends BaseCrudComponent {

    modelNamespace = 'dept';

    modalHandlers = {
        prevHandleRecord: {
            update: record => {
                console.log(record);
                return record;
            }
        },
        onSubmit: {
            save: (values) => {
                this.props.dispatch({
                    type: `${this.modelNamespace}/save`,
                    payload: {
                        values,
                        success: this.closeModel
                    }
                });
            },
            update: (values, record) => {
                this.props.dispatch({
                    type: `${this.modelNamespace}/update`,
                    payload: {
                        values,
                        record,
                        success: this.closeModel
                    }
                });
            }
        },
        onCancel: {
            default: this.closeModel
        }
    };

    onDelete = records => {
        const { rows } = this.state;

        this.props.dispatch({
            type: `${this.modelNamespace}/delete`,
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
        const { dept, loading, dispatch } = this.props;
        const { pageInfo, allDepts } = dept;
        const columns = createColumns(this, allDepts);
        const { modalType, modalTitle, rows, record, visible } = this.state;

        const searchBarProps = {
            columns,
            onSearch: this.search
        };

        const dataTableProps = {
            loading,
            columns,
            pageInfo,
            rowKey: 'id',
            selectType: 'checkbox',
            isScroll: true,
            selectedRowKeys: rows.map(item => item.rowKey),
            onChange: this.jumpPage,
            onSelect: this.selectRow
        };

        const modalFormProps = {
            title: modalTitle,
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
