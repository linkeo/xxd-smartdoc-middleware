import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import './Container.less';

const { Item, Divider } = Menu;
const { Sider, Content, Footer } = Layout;

function ChromeFooter() {
  return (
    <Footer
      style={{
        textAlign: 'center',
        fontSize: '1rem',
        backgroundColor: 'crimson',
        color: 'whitesmoke',
      }}
    >请使用<a style={{ color: 'khaki' }} href="http://www.google.cn/chrome/browser/">主版本号不低于42的Google Chrome浏览器</a>访问此页面，以保证正常的体验</Footer>
  );
}

function IndexPage({ children }) {
  return (
    <Layout className="container-container">
      <Layout>
        <Sider>
          <Menu className="left-menu">
            <Item><Link to="/"><Icon type="home" /> {app.title || app.name}</Link></Item>
            <Divider />
            {app.modules.map((module, index) => (
              <Item key={index}>
                <Link to={`/${module.name}`}><Icon type="appstore-o" /> {module.title || module.name}</Link>
              </Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content id="right-container" className="right-container">
            {children}
          </Content>
        </Layout>
      </Layout>
      { !isSafeChrome() ? <ChromeFooter /> : null }
    </Layout>
  );
}

function isSafeChrome() {
  const chrome = window.navigator.userAgent.match(/Chrome\/(\d+)/);
  if (!chrome) {
    return false;
  }
  const version = Number(chrome[1]);
  if (version < 42) {
    return false;
  }
  return true;
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
