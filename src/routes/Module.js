import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Alert, Timeline, Affix, Card, Row, Col, Switch, Icon, Input } from 'antd';
import Method from '../components/Method';
import Markdown from '../components/Markdown';
import ActionCard from '../components/ActionCard';
import ActionSearch from '../components/ActionSearch';
import './Module.less';

const { Item } = Timeline;

class Module extends React.Component {

  constructor(props) {
    super(props);
    this.actions = {};
  }

  componentDidMount() {
    const { params: { action } } = this.props;
    this.scrollToAction(action);
  }

  scrollToAction(actionName) {
    if (actionName && this.actions[actionName]) {
      const scroller = document.querySelector('#right-container').parentNode;
      const node = findDOMNode(this.actions[actionName]);
      if (node) {
        const rect = node.getBoundingClientRect();
        if (rect) {
          const scrollY = rect.top - 16;
          scroller.scrollTop += scrollY;
        }
      }
    }
  }

  render() {
    const { params, enableTest, dispatch, token } = this.props;
    const module = app.modules.filter(mod => mod.name === params.module)[0];
    const unfoldAction = params.action;

    if (!module) {
      return (
        <Alert
          type="error"
          message="该页面出现错误"
          description={`找不到模块 "${params.module}"`}
          showIcon
        />
      );
    }

    return (
      <div className="container-module">
        <Card
          title={<div>
            <Icon type="appstore-o" className="title-icon" />
            <span>{module.title}</span>
          </div>}
          className="module-header"
          bordered={false}
          style={{ marginBottom: 16 }}
        >
          {module.description ? (<div className="module-description"><Markdown content={module.description} /></div>) : null}
          {module.notes.map((note, index) => (
            <Alert key={index} type="warning" message={<span><strong>NOTE: </strong><span><Markdown content={note} /></span></span>} />
          ))}
          {module.notes.length > 0 ? <br /> : null}
          <Timeline style={{ marginTop: 8 }}>
            {module.actions.map(action => (
              <Item key={action.name} color={Method.color(action.route.method)}>
                <Link
                  to={`/${module.name}/${action.name}`}
                  onClick={() => {
                    setTimeout(() => this.scrollToAction(action.name), 0);
                  }}
                  style={{ display: 'block', color: '#666' }}
                >
                  <Method method={action.route.method} simple />
                  <code>{action.route.path}</code>
                  <span className="right-mute">{action.title}</span>
                </Link>
              </Item>
            ))}
          </Timeline>
        </Card>

        {module.actions.map(action => (
          <ActionCard
            ref={(ref) => { this.actions[action.name] = ref; }}
            module={module}
            action={action}
            key={action.name}
            unfold={action.name === unfoldAction}
          />
        ))}
        <div className="float-right">
          <Affix
            offsetTop={16}
            target={() => document.querySelector('#right-container').parentNode}
          >
            <ActionSearch />
            <Card title="接口导航" bordered={false} style={{ marginTop: 16 }}>
              <Timeline style={{ marginTop: 8 }}>
                {module.actions.map((action, index) => (
                  <Item key={index} color={Method.color(action.route.method)}>
                    <Link
                      to={`/${module.name}/${action.name}`}
                      onClick={() => {
                        setTimeout(() => this.scrollToAction(action.name), 0);
                      }}
                      style={{ display: 'block', color: '#666' }}
                    >
                      <Method method={action.route.method} simple />
                      <code>{action.route.path}</code>
                    </Link>
                  </Item>
                ))}
              </Timeline>
            </Card>
            <Card bordered={false} style={{ marginTop: 16 }}>
              <Row type="flex" align="middle" gutter={8}>
                <Col span={18}>接口测试</Col>
                <Col span={6}>
                  <Switch
                    checked={enableTest}
                    onChange={(value) => {
                      dispatch({
                        type: 'options/set',
                        key: 'enableTest',
                        value,
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row type="flex" align="middle" gutter={8} style={{marginTop: '30px'}}>
                <Col span={6}>TOKEN</Col>
                <Col span={18}>
                  <Input
                    value={token}
                    onChange={(event) => {
                      dispatch({
                        type: 'options/set',
                        key: 'token',
                        value: event.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Affix>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ options }) {
  return {
    enableTest: options.enableTest,
    token: options.token,
  };
}

export default connect(mapStateToProps)(Module);
