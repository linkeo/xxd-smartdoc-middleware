const storageKey = 'smartdoc-option';

export default {

  namespace: 'options',

  state: Object.assign({
    enableTest: false,
  }, window.globalOptions),

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      if (global.localStorage) {
        const stored = localStorage.getItem(storageKey);
        try {
          dispatch({
            type: 'init',
            value: JSON.parse(stored),
          });
        } catch (err) {
          console.error('Cannot read options in localStorage, reset it.');
          localStorage.setItem(storageKey, '{}');
        }
      }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    init(state, { value }) {
      return { ...state, ...value };
    },
    set(state, { key, value }) {
      if (key !== undefined && value !== undefined) {
        const nstate = { ...state, [key]: value };
        localStorage.setItem(storageKey, JSON.stringify(nstate));
        return nstate;
      }
      return state;
    },
  },

};
