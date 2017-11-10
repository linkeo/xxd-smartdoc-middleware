import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon, Row, Col, Card, Checkbox, Alert, Badge, Button, Tag, Select } from 'antd';
import Inspector, { chromeLight } from 'react-inspector';
import URL from 'url';
import querystring from 'querystring';
import PATH from 'path';
import ParamInput from './ParamInput';
import Method from './Method';
import './ActionCard.less';
import apiRoot from '../utils/api_mount_root';
import Markdown from './Markdown';

class ActionCard extends React.Component {

  generateRequestOptions() {
    const { action, params = {} } = this.props;
    const method = action.route.method.toUpperCase();
    let path = action.route.path;

    const options = {
      method,
      credentials: 'include',
    };

    const testParams = {};
    for (const name of Object.keys(params)) {
      const { type, value, selected } = params[name];
      if (selected) {
        if (path.match(new RegExp(`:${name}(?=\\W|$)`))) {
          const encodedValue = encodeURIComponent(`${ParamInput.parse(type, value)}`);
          path = path.replace(new RegExp(`:${name}(?=\\W|$)`, 'g'), encodedValue);
        } else {
          testParams[name] = ParamInput.parse(type, value);
        }
      }
    }

    const url = URL.parse(apiRoot || '/');
    if (module.path) { url.pathname = PATH.join(url.pathname, module.path); }
    url.pathname = PATH.join(url.pathname, path);
    if (!/^(?:POST|PUT)$/i.test(method)) {
      url.query = testParams;
    } else {
      options.body = new URLSearchParams(querystring.stringify(testParams));
    }
    options.uri = URL.format(url);

    return options;
  }

  performRequest() {
    const { dispatch, action } = this.props;
    const options = this.generateRequestOptions();
    // console.log(options);

    dispatch({
      type: 'action/request',
      action: action.name,
      options,
    });
  }

  render() {
    const {
      dispatch, module, action, unfold, enableTest, params = {}, began, pending, res = {}, err,
    } = this.props;

    const admincheck = (action.middlewares || []).some(mw => mw && mw.name === 'admincheck');
    const sessioncheck = (action.middlewares || []).some(mw => mw && mw.name === 'sessioncheck');

    if (!unfold) {
      return (
        <Card
          id={`#${action.route.method}-${action.route.path}`}
          className="component-action-card component-action-card-folded"
          title={<Link to={`/${module.name}/${action.name}`}>
            <Method method={action.route && action.route.method} />
            <code>{action.route && action.route.path}</code>
          </Link>}
          extra={<Link to={`/${module.name}/${action.name}`}>
            {admincheck && <Tag color="cyan">后台接口</Tag>}
            {sessioncheck && <Tag color="blue">需要登录</Tag>}
            <span>{action.title}</span>
            <Icon type="arrows-alt" style={{ marginLeft: '24px' }} />
          </Link>}
          style={{ marginBottom: '16px' }}
          bordered={false}
        />
      );
    }


    const options = this.generateRequestOptions();
    const actionParams = action.params.filter(p => p.mismatch === undefined);

    const requestPreview = `${options.method} ${options.uri}\n${options.data ? options.data.toString() : ''}`;

    return (
      <Card
        id={`#${action.route.method}-${action.route.path}`}
        className="component-action-card"
        title={<Link to={`/${module.name}`}>
          <Method method={action.route && action.route.method} />
          <code>{action.route && action.route.path}</code>
        </Link>}
        extra={<Link to={`/${module.name}`}>
          {admincheck && <Tag color="cyan">后台接口</Tag>}
          {sessioncheck && <Tag color="blue">需要登录</Tag>}
          <span>{action.title}</span>
          <Icon type="shrink" style={{ marginLeft: 24 }} />
        </Link>}
        style={{ marginBottom: '16px' }}
        bordered={false}
      >
        {/* <Inspector
          theme={{ ...chromeLight }}
          data={action}
          expandLevel={5}
        /> */}
        {action.description || action.notes.length > 0 ? (
          <Card bordered={false} style={{ marginBottom: 8 }}>
            {action.description ? <Markdown className="action-description" content={action.description} /> : null }
            {action.notes.map((note, index) => (
              <Alert key={index} type="warning" message={<span><p className="text-right"><strong>NOTE</strong></p><Markdown content={note} /></span>} />
            ))}
          </Card>
        ) : null}
        {actionParams.length > 0 ? (
          <Row gutter={16} className="action-section">
            <Col span={2} className="action-section-name">参数</Col>
            <Col span={22}>
              <Card bordered={false} className="params-card">
                {actionParams.map((param, index) => (
                  <Row key={index} gutter={8}>
                    <Col span={6} className="text-col"><code>{param.name}</code></Col>
                    <Col span={6} className="text-col"><code>{param.type}</code></Col>
                    <Col span={12}>
                      {enableTest ? <Row className="param-input">
                        <Col span={2}>
                          <Checkbox
                            style={{ marginTop: 7 }}
                            checked={!!(params[param.name] || {}).selected}
                            onChange={(e) => {
                              const { checked } = e.target;
                              dispatch({
                                type: 'action/selectParam',
                                action: action.name,
                                name: param.name,
                                selected: checked,
                              });
                            }}
                          />
                        </Col>
                        <Col span={22}>
                          <ParamInput
                            type={param.type}
                            value={(params[param.name] || {}).value}
                            onChange={(value, valid) => valid && dispatch({
                              type: 'action/setParam',
                              action: action.name,
                              name: param.name,
                              paramType: param.type,
                              value,
                            })}
                          />
                        </Col>
                      </Row> : null}
                      {param.description ? <Alert className="param-description" type="info" message={param.description} /> : null}
                    </Col>
                  </Row>
                ))}
              </Card>
            </Col>
          </Row>
        ) : null}
        {enableTest ? (
          <Row gutter={16} className="action-section">
            <Col span={2} className="action-section-name">请求</Col>
            <Col span={22}>
              <Card bordered={false} className="request-preview-card">
                <Button type="primary" shape="circle" icon="rocket" className="send-button" disabled={pending} onClick={() => pending || this.performRequest()} />
                <pre>{requestPreview}</pre>
              </Card>
            </Col>
          </Row>
        ) : null}
        {enableTest ? (
          <Row gutter={16} className="action-section">
            <Col span={2} className="action-section-name">响应</Col>
            <Col span={22}>
              <Card bordered={false} className="response-card">
                {!began ? (
                  <Badge status="default" text="等待发送请求" />
                ) : (
                  pending ? (
                    <Badge status="processing" text="请求中，等待响应" />
                  ) : (
                    err ? (
                      <div>
                        <Badge status="error" text="请求出错" />
                        <br />
                        <br />
                        <Alert type="error" message={<pre>{err.stack || JSON.stringify(err, 0, 2)}</pre>} />
                      </div>
                    ) : (
                      <div>
                        <Badge
                          status={(res.status >= 200 && res.status < 300) ? 'success' : 'error'}
                          text={`${res.status} ${res.statusText}`}
                        />
                        <br />
                        <Badge
                          status={(res.code === 0) ? 'success' : 'error'}
                          text={`CODE: ${res.code}`}
                        />
                        <br />
                        <Badge
                          status={timeDurationLevel(res.elapsedTime)}
                          text={timeDurationFormat(res.elapsedTime)}
                        />
                        <br />
                        <br />
                        {res.msg ? (
                          <Alert type="error" message={<pre>{
                            res.err ? [
                              res.msg,
                              '==========',
                              res.err.msg,
                              'at ' + res.err.pos,
                            ].join('\n') : res.msg
                          }</pre>} />
                        ) : (
                          res.data ? (
                            <Alert
                              className="response-preview"
                              type="success"
                              message={
                                <Inspector
                                  theme={{ ...chromeLight, ...({ BASE_BACKGROUND_COLOR: 'transparent' }) }}
                                  data={res.data}
                                  expandLevel={5}
                                />
                              }
                            />
                          ) : (
                            <Alert type="success" message="接口调用成功！" />
                          )
                        )}
                      </div>
                    )
                  )
                )}
              </Card>
            </Col>
          </Row>
        ) : null}
      </Card>
    );
  }
}

function timeDurationFormat(t) {
  if (t < 1500) {
    return `${t}ms`;
  }
  if (t < 90000) {
    return `${(t / 1000).toFixed(3).replace(/0+$/, '')}s`;
  }
  return `${(t / 60000).toFixed(3).replace(/0+$/, '')}m`;
}

function timeDurationLevel(t) {
  if (t < 500) {
    return 'success';
  }
  if (t < 5000) {
    return 'warning';
  }
  return 'error';
}

function mapStateToProps({ action, options }, ownProps) {
  return Object.assign({
    enableTest: options.enableTest,
    testStatus: null,
  }, action[ownProps.action.name]);
}

export default connect(mapStateToProps)(ActionCard);
