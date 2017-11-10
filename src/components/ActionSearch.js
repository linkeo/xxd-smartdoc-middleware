import React from 'react';
import _ from 'lodash';
import { Row, Col, Input, AutoComplete, message } from 'antd';
import './ActionSearch.less';
import Method from './Method';

const dataset = app.modules.map(module => module.actions.map(action => ({
  key: `${(action.route || {}).method} ${(action.route || {}).path}`.toLowerCase(),
  method: ((action.route || {}).method || '').toUpperCase(),
  path: ((action.route || {}).path || '').toLowerCase(),
  module,
  action,
}))).reduce((a, b) => a.concat(b), []);

const Option = AutoComplete.Option;

function searchResult(query) {
  if (!query) {
    return [];
  }
  const keyword = query.trim().toLowerCase();
  const pattern = new RegExp(keyword.split(' ').map(_.escapeRegExp).join('.*'));

  const result = dataset.filter((item) => pattern.test(item.method + ' ' + item.path)).sort((a, b) => a.path.length - b.path.length);

  return result.map(item => ({
    query,
    key: `${item.module.name}-${item.action.name}`,
    module: item.module.name,
    action: item.action.name,
    route: `${(item.action.route || {}).method} ${(item.action.route || {}).path}`,
    method: (item.action.route || {}).method,
    path: (item.action.route || {}).path,
    actionTitle: item.action.title,
    moduleTitle: item.module.title,
    link: `/${item.module.name}/${item.action.name}`,
  }));
}

function renderOption(item) {
  return (
    <Option className="component-action-search-result-item" key={item.key} text={item.query}>
      <div>
        <Method method={item.method} />
        <code>{item.path}</code>
      </div>
      <div>
        <Row gutter={8}>
          <Col className="muted-info" span={10} offset={6}>{item.actionTitle}</Col>
          <Col className="muted-info" span={8}>{item.moduleTitle}</Col>
        </Row>
      </div>
    </Option>
  );
}

class ActionSearch extends React.Component {

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  state = {
    dataSource: [],
    value: '',
  }

  onSelect = (value) => {
    const item = (this.state.dataSource || []).filter(e => e.key === value)[0];
    if (item) {
      this.context.router.push(item.link);
    } else {
      message.error(`没找到"${value}"，请联系开发者`);
    }
    setTimeout(() => {
      this.setState({ value: '' });
    }, 0);
  }

  handleChange = (value) => {
    this.setState({
      value,
      dataSource: searchResult(value),
    });
  }

  render() {
    const { dataSource, value } = this.state;
    return (
      <div className="component-action-search-wrapper">
        <AutoComplete
          className="component-action-search"
          size="large"
          style={{ width: '100%' }}
          dataSource={dataSource.map(renderOption)}
          value={value}
          onChange={this.handleChange}
          onSelect={this.onSelect}
          placeholder="按API地址搜索接口"
          optionLabelProp="text"
          filterOption={false}
        >
          <Input />
        </AutoComplete>
      </div>
    );
  }
}

export default ActionSearch;
// export default connect(() => ({}))(ActionSearch);
