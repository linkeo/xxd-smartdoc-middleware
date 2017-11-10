
export default {

  namespace: 'action',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },

    *request({ action, options }, { call, put }) {
      yield put({
        type: 'requestPending',
        action,
      });
      try {
        const result = {};
        const start = Date.now();
        const response = yield call(fetch, options.uri, options);
        result.elapsedTime = Date.now() - start;
        result.headers = { ...response.headers };
        result.status = response.status;
        result.statusText = response.statusText;
        const json = yield call(response.json.bind(response));
        Object.assign(result, json);
        yield put({
          type: 'requestDone',
          action,
          res: result,
        });
      } catch (err) {
        yield put({
          type: 'requestError',
          action,
          err: {
            name: err.name,
            message: err.message,
            stack: err.stack,
            code: err.code,
            status: err.status,
          },
        });
      }
    },
  },

  reducers: {
    setParam(state, { action, name, paramType: type, value }) {
      const params = {
        ...(state[action] || {}).params,
        [name]: {
          type,
          value,
          selected: value != null && value !== '',
        },
      };
      const actionObj = { ...state[action], params };
      return { ...state, [action]: actionObj };
    },
    selectParam(state, { action, name, selected }) {
      const param = {
        ...((state[action] || {}).params || {})[name],
        selected,
      };
      const params = { ...(state[action] || {}).params, [name]: param };
      const actionObj = { ...state[action], params };
      return { ...state, [action]: actionObj };
    },
    requestPending(state, { action }) {
      const actionObj = { ...state[action], res: null, err: null, pending: true, began: true };
      return { ...state, [action]: actionObj };
    },
    requestDone(state, { action, res }) {
      const actionObj = { ...state[action], res, pending: false, began: true };
      return { ...state, [action]: actionObj };
    },
    requestError(state, { action, err }) {
      console.error(err);
      const actionObj = { ...state[action], err, pending: false, began: true };
      return { ...state, [action]: actionObj };
    },
  },

};
