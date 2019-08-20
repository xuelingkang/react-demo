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
import { getAuth } from '@/utils/authentication';
import './index.less';

const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;
const { user: currentUser } = getAuth();

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
        this.searchReply(true);
    }

    closeLetter = () => {
        this.setState({
            letterReplySize: 0,
            letterId: null,
            recordLetter: {},
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
                values,
                success: () => this.searchReply(false)
            }
        });
    }

    deleteReply = ids => {
        const { dispatch } = this.props;
        dispatch({
            type: `${modelNamespace}/deleteReply`,
            payload: {
                ids,
                success: () => this.searchReply(false)
            }
        });
    }

    searchReply = async next => {
        let { recordLetter, letterReplySize=0 } = this.state;
        const {id} = recordLetter;
        if (next) {
            letterReplySize += 10;
        }
        const { dispatch } = this.props;
        await dispatch({
            type: `${modelNamespace}/searchReply`,
            payload: {
                params: {
                    letterId: id,
                    current: 1,
                    size: letterReplySize
                }
            }
        });
        const { modelState } = this.props;
        const { replys } = modelState;
        if (replys.length < letterReplySize) {
            this.setState({
                letterReplyMore: false,
                letterReplySize: replys.length
            });
        } else {
            this.setState({
                letterReplyMore: true
            });
        }
    }

    addAttachment = ({id}) => {
        const {record={}} = this.state;
        const {attachments=[]} = record;
        this.setState({
            record: {
                ...record,
                attachments: attachments.concat({id})
            }
        });
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
        const { pageInfo, allUsers, replys } = modelState;
        const columns = createColumns(this, currentUser, allUsers);
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
            currentUser,
            letterReplyMore,
            loading,
            replys,
            title: '查看留言',
            record: recordLetter,
            visible: visibleLetter,
            width: 700,
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
                                        <Button disabled={!rows.length || rows.some(({letterUserId}) => letterUserId!==currentUser.id)}
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
