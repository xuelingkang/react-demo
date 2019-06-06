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

    modalHandlers = {
        onCancel: {
            default: this.closeModal
        }
    };

    updateReadStatus = records => {
        const {dispatch} = this.props;
        const unReads = records.filter(({readStatus}) => !readStatus);
        if (unReads && unReads.length) {
            const recordKeys = unReads.map(({rowKey}) => rowKey).join();
            dispatch({
                type: `${modelNamespace}/update`,
                payload: {
                    recordKeys,
                    success: () => this.updateReadStatusSuccess(records)
                }
            });
        } else {
            this.updateReadStatusSuccess(records);
        }
    }

    updateReadStatusSuccess = records => {
        this.closeModal();
        const { rows } = this.state;
        this.setState({
            rows: rows.filter(
                item => !records.some(jtem => jtem.rowKey === item.rowKey)
            )
        });
        const {dispatch} = this.props;
        dispatch({
            type: 'global/delBroadcasts',
            payload: {
                ids: records.map(({id}) => id)
            }
        });
    }

    render() {
        const { modelState, loading } = this.props;
        const { pageInfo, allUsers } = modelState;
        const columns = createColumns(this, allUsers);
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
                width: 700,
                footer: [
                    <Button key="back" onClick={this.closeModal}>
                        关闭
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => this.updateReadStatus([record])} loading={loading}>
                        已读
                    </Button>
                ]
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
                                    resource='http./broadcast/*.PUT'
                                    component={
                                        <Button disabled={!rows.length}
                                                icon="check"
                                                onClick={() => this.updateReadStatus(rows)}>
                                            标为已读
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
