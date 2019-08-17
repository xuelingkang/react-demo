import React from 'react';
import { connect } from 'dva';
import {Layout, Button} from 'antd';
import BaseCrudComponent, { isLoading } from 'components/BaseCrudComponent';
import Toolbar from 'components/Toolbar';
import SearchBar from 'components/SearchBar';
import DataTable from 'components/DataTable';
import { ModalForm, ModalLetter } from 'components/Modal';
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

    openLetter = async (record, prepareRecord) => {
        if (record && prepareRecord) {
            record = await prepareRecord(record);
        }
        this.setState({
            recordLetter: record,
            visibleLetter: true,
            letterReplySize: 0,
            letterReplyMore: true
        });
    }

    closeLetter = () => {
        this.setState({
            letterReplySize: null,
            letterId: null,
            recordLetter: null,
            visibleLetter: false
        });
        const { dispatch } = this.props;
        dispatch({
            type: `${modelNamespace}/clearReplys`
        });
    }

    saveReply = values => {
        const { dispatch } = this.props;
        dispatch({
            type: `${modelNamespace}/saveReply`,
            payload: {
                values
            }
        });
    }

    deleteReply = ids => {
        const { dispatch } = this.props;
        dispatch({
            type: `${modelNamespace}/deleteReply`,
            payload: {
                ids
            }
        });
    }

    searchReply = async () => {
        let { recordLetter, letterReplySize=0, letterReplyMore=true } = this.state;
        if (letterReplyMore) {
            const {id} = recordLetter;
            letterReplySize += 10;
            const { dispatch } = this.props;
            await dispatch({
                type: `${modelNamespace}/searchReply`,
                payload: {
                    params: {
                        letterId: id,
                        size: letterReplySize
                    }
                }
            });
            const { modelState } = this.props;
            const { replys } = modelState;
            if (replys.length < letterReplySize) {
                this.setState({
                    letterReplyMore: false
                });
            }
        }
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
        const { modalType, modalTitle, modalLoading, rows, record, visible, visibleLetter, recordLetter, letterReplyMore } = this.state;

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
                width: 700
            },
            handlers: this.modalHandlers
        };

        const modalLetterProps = {
            letterReplyMore,
            loading,
            title: '查看留言',
            record: recordLetter,
            visible: visibleLetter,
            centered: true,
            destroyOnClose: true,
            width: 700,
            footer: null,
            onSave: this.saveReply,
            onDelele: this.deleteReply,
            onSearch: this.searchReply,
            onCancel: this.closeLetter
        };

        return (
            <Layout className="full-layout crud-page">
                <Header>
                    <Toolbar
                        appendLeft={
                            <Button.Group>
                                <CheckResource
                                    resource='http./letter.POST'
                                    component={
                                        <Button type="primary"
                                                icon="plus"
                                                onClick={() => this.openModal('save', '留言')}>
                                            新增
                                        </Button>
                                    }
                                />
                                <CheckResource
                                    resource='http./letter/*.DELETE'
                                    component={
                                        <Button disabled={!rows.length}
                                                icon='delete'
                                                onClick={() => this.delete(rows)}>
                                            删除
                                        </Button>
                                    }
                                />
                            </Button.Group>
                        }
                        pullDown={<SearchBar type='grid' {...searchBarProps} />}
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
                <ModalLetter {...modalLetterProps} />
            </Layout>
        );
    }

}
