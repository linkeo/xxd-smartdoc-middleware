import React from 'react';
import { connect } from 'dva';
import { Icon, Row, Col } from 'antd';
import ModuleCard from '../components/ModuleCard';
import ActionSearch from '../components/ActionSearch';
import './Home.less';

function Home() {
  return (
    <div className="container-home">
      <div className="project-header">
        <div className="project-title">{app.title || app.name}</div>
        <div className="project-description">{app.description}</div>
        <div className="property-line">
          <div>
            {app.version ? <span className="property"><Icon type="tags-o" /> {app.version}</span> : null}
            {app.author ? <span className="property"><Icon type="user" /> {app.author}</span> : null}
          </div>
          {app.address ? <div><span className="property"><Icon type="link" /> {app.address}</span></div> : null}
        </div>
      </div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8} offset={8}>
          <ActionSearch />
        </Col>
      </Row>
      <div className="module-overview">
        <Row gutter={16}>
          { app.modules.map((mod, index) => (
            <Col key={index} span={8}>
              <ModuleCard module={mod} folded={!!(index > 5)} />
            </Col>
          )) }
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Home);
