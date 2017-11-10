import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import Container from './routes/Container';
import Home from './routes/Home';
import Module from './routes/Module';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Container}>
        <IndexRoute component={Home} />
        <Route path=":module">
          <IndexRoute component={Module} />
          <Route path=":action" component={Module} />
        </Route>
      </Route>
    </Router>
  );
}

export default RouterConfig;
