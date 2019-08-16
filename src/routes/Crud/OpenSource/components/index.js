import React from 'react';
import { connect } from 'dva';
import {Layout, Button, Modal} from 'antd';
import Editor from 'for-editor';
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

    openIntro = async (record, prepareRecord) => {
        if (record && prepareRecord) {
            record = await prepareRecord(record);
        }
        this.setState({
            recordIntro: record,
            visibleIntro: true
        });
    }

    closeIntro = () => {
        this.setState({
            recordIntro: null,
            visibleIntro: false
        })
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
        const { pageInfo, allUsers } = modelState;
        const columns = createColumns(this, allUsers);
        const { modalType, modalTitle, modalLoading, rows, record, visible, visibleIntro, recordIntro } = this.state;

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
            loading: loading || modalLoading,
            record,
            visible,
            columns,
            modalOpts: {
                width: '80%'
            },
            handlers: this.modalHandlers
        };

        const modalReadmeProps = {
            loading,
            title: '说明文档',
            centered: true,
            destroyOnClose: true,
            width: '80%',
            visible: visibleIntro,
            footer: null,
            onCancel: this.closeIntro
        };

        const readme = recordIntro && recordIntro.intro && recordIntro.intro.readme || null;

        const editorReadmeProps = {
            value: readme,
            preview: true,
            height: (document.body.offsetHeight-110<600 && document.body.offsetHeight-110>300)? (document.body.offsetHeight-110): 600,
            toolbar: {
                expand: true
            }
        };

        return (
            <Layout className="full-layout crud-page">
                <Header>
                    <Toolbar
                        appendLeft={
                            <Button.Group>
                                <CheckResource
                                    resource='http./open.POST'
                                    component={
                                        <Button type="primary"
                                                icon="plus"
                                                onClick={() => this.openModal('save', '保存组件')}>
                                            新增
                                        </Button>
                                    }
                                />
                                <CheckResource
                                    resource='http./open/*.DELETE'
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
                <Modal {...modalReadmeProps} >
                    <Editor {...editorReadmeProps} />
                </Modal>
            </Layout>
        );
    }

}
