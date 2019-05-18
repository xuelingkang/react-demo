import React from 'react';
import { connect } from 'dva';
import { Layout, Button } from 'antd';
import BaseCrudComponent, { isLoading } from 'components/BaseCrudComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm } from 'components/Modal';
import createColumns from './columns';
import { modelNamespace } from '../constant';
import './index.less';
const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

@connect(({ [modelNamespace]: modelState, loading }) => ({
    modelNamespace,
    modelState,
    loading: isLoading(loading, modelNamespace)
}))
export default class extends BaseCrudComponent {

    modalHandlers = {
        prepareRecord: {
            update: this.requestRecord,
            detail: this.requestRecord
        },
        onSubmit: {
            save: this.submitSave,
            update: this.submitUpdate
        },
        onCancel: {
            default: this.closeModel
        }
    };

    render() {
        const { modelState, loading } = this.props;
        const { pageInfo, allDepts } = modelState;
        const columns = createColumns(this, allDepts);
        const { modalType, modalTitle, rows, record, visible } = this.state;

        const searchBarProps = {
            columns,
            onSearch: this.onSearch
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
                                <Button type="primary"
                                        icon="plus"
                                        onClick={() => this.openModal('save', '保存部门')}>
                                    新增
                                </Button>
                                <Button disabled={!rows.length}
                                        icon="delete"
                                        onClick={() => this.delete(rows)}>
                                    删除
                                </Button>
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
                {visible? <ModalForm {...modalFormProps} />: null}
            </Layout>
        );
    }

}
