import $$ from 'cmn-utils';

const CHANGE_STATE = '@change';
const CHANGE_STATE_SUCCESS = '@change_success';

export const simpleModel = {
    namespace: $$.randomStr(4),
    enhance: true,
    state: {},
    effects: {},
    reducers: {}
};

export default model => {
    const {namespace, state, subscriptions, effects, reducers, enhance} = {
        ...simpleModel,
        ...model
    };

    if (!enhance) {
        return {namespace, state, subscriptions, effects, reducers};
    }
    return {
        namespace,
        state,
        subscriptions,
        effects: {
            ...effects,
            * [CHANGE_STATE]({payload, success}, {put}) {
                yield put({
                    type: CHANGE_STATE_SUCCESS,
                    payload
                });

                if ($$.isFunction(success)) {
                    success();
                }
            }
        },

        reducers: {
            ...reducers,
            [CHANGE_STATE_SUCCESS]: _changeState
        }
    };
};

const _changeState = (state, {payload}) => ({
    ...state,
    ...payload
});
