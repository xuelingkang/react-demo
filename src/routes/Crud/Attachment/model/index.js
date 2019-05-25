import modelEnhance from '@/utils/modelEnhance';
import PageInfo from '@/utils/pageInfo';
import {axiosDownload} from '@/utils/axios';
import saveBlob from '@/utils/saveBlob';
import {del, detail} from '../service';
import {modelNamespace} from '../constant';

export default modelEnhance({

    namespace: modelNamespace,

    state: {
        pageInfo: new PageInfo('/attachment/{current}/{size}')
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(({pathname}) => {
                if (pathname === '/attachment') {
                    dispatch({
                        type: 'init'
                    });
                }
            });
        }
    },

    effects: {
        // 进入页面加载
        * init({payload}, {put}) {
            yield put({
                type: 'refresh'
            });
        },
        * delete({payload}, {call, put}) {
            const {recordKeys, success} = payload;
            const {code} = yield call(del, {ids: recordKeys});
            if (code === 200) {
                success && success();
                yield put({
                    type: 'refresh'
                });
            }
        },
        * detail({payload}, {call, put, select}) {
            const {pageInfo} = yield select(state => state[modelNamespace]);
            const {rowKey: id} = payload;
            const {code, data} = yield call(detail, {id});
            if (code === 200) {
                const records = pageInfo.records.map(item => item.id === id ? {
                    ...item,
                    ...data
                } : item);
                yield put({
                    type: '@change',
                    payload: {
                        pageInfo: {
                            ...pageInfo,
                            records
                        }
                    }
                });
                return data;
            }
        },
        * search({payload}, {select, put}) {
            const {pageInfo} = yield select(state => state[modelNamespace]);
            const pageInfo_ = yield pageInfo.search();
            yield put({
                type: '@change',
                payload: {
                    pageInfo: pageInfo_,
                }
            });
        },
        * download({payload}) {
            const {record} = payload;
            const {attachmentAddress} = record;
            const {status, data} = yield axiosDownload(attachmentAddress);
            if (status===200) {
                saveBlob(data, attachmentAddress.split('/').reverse()[0]);
            }
        },
        * refresh({payload}, {put}) {
            yield put({
                type: 'search'
            });
        }
    },

    reducers: {}
});
