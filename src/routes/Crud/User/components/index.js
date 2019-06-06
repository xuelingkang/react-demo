import React from 'react';
import { connect } from 'dva';
import {Layout, Button, Form, Table} from 'antd';
import BaseCrudComponent, { isLoading } from 'components/BaseCrudComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import { modelNamespace } from '../constant';
import CheckResource from '@/utils/checkResource';
import './index.less';

const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ [modelNamespace]: modelState, loading }) => ({
    modelNamespace,
    modelState,
    loading: isLoading(loading, modelNamespace)
}))
export default class extends BaseCrudComponent {

    expandedRowRender = (record) => {
        const columns = [
            {title: '角色名称', dataIndex: 'roleName', key: 'roleName'},
            {title: '角色描述', dataIndex: 'roleDesc', key: 'roleDesc'},
            {title: '角色顺序', dataIndex: 'roleSeq', key: 'roleSeq'},
        ];
        const {roles} = record;
        return <Table rowKey='id' columns={columns} dataSource={roles} pagination={false} />;
    }

    modalHandlers = {
        onSubmit: {
            save: this.submitSave,
            update: this.submitUpdate
        },
        onCancel: {
            default: this.closeModal
        }
    };

    render() {
        const { modelState, loading } = this.props;
        const { pageInfo, allDepts, allRoles } = modelState;
        const columns = createColumns(this, allDepts, allRoles);
        const { modalType, modalTitle, rows, record, visible } = this.state;

        const searchBarProps = {
            columns,
            onSearch: this.onSearch
        };

        const dataTableProps = {
            className: "components-table-demo-nested",
            onExpand: (expanded, record) => expanded && this.requestDetail(record),
            expandedRowRender: this.expandedRowRender,
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
                                <CheckResource
                                    resource='http./user.POST'
                                    component={
                                        <Button type="primary"
                                                icon="plus"
                                                onClick={() => this.openModal('save', '保存用户')}>
                                            新增
                                        </Button>
                                    }
                                />
                                <CheckResource
                                    resource='http./user/*.DELETE'
                                    component={
                                        <Button disabled={!rows.length}
                                                icon="delete"
                                                onClick={() => this.delete(rows)}>
                                            删除
                                        </Button>
                                    }
                                />
                            </Button.Group>
                        }
                        pullDown={<SearchBar type="grid" {...searchBarProps} />}
                    >
                        <SearchBar group="close" {...searchBarProps} />
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
