import React from 'react';
import { Link } from 'dva/router';
import { Card, Menu, Icon, Badge } from 'antd';
import classnames from 'classnames';
import Method from './Method';
import './ModuleCard.less';

const { Item } = Menu;

const ModuleCard = ({ module: { name = '', title = '', actions = [] } = {}, folded = false }) => {
  const more = actions.length > 4;

  return (
    <Card
      className={classnames({
        'component-module-card': true,
        'component-module-card-folded': !!folded,
      })}
      title={<Link to={`/${name}`} className="block">
        <Icon type="appstore-o" className="title-icon" />
        <span>{title || name}</span>
      </Link>}
      extra={<Link to={`/${name}`}><Badge style={{ backgroundColor: '#108ee9' }} count={actions.length} /></Link>}
      bordered={false}
    >
      <Menu>
        { (more ? actions.slice(0, 3) : actions).map((action, index) => {
          return (
            <Item key={index}>
              <Link to={`/${name}/${action.name}`} className="block">
                <Method method={action.route.method} />
                <code>{action.route.path}</code>
                <span className="right-mute">{action.title}</span>
              </Link>
            </Item>
          );
        }) }
        { more ? (<Item>
          <Link to={`/${name}`} className="block link-more">
            查看更多接口
          </Link>
        </Item>) : null }
      </Menu>
    </Card>
  );
};

ModuleCard.propTypes = {
};

export default ModuleCard;
