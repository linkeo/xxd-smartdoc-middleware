import React from 'react';
import { Tag } from 'antd';

const Method = ({ method, simple }) => {
  const factory = ({ text, color }) => (simple ? (
    <code style={{ color, marginRight: 8 }}>{text}</code>
  ) : (
    <Tag color={color}><code>{text}</code></Tag>
  ));

  switch (method && method.toUpperCase()) {
    case 'GET': return factory({ color: '#00A854', text: 'GET' });
    case 'POST': return factory({ color: '#108ee9', text: 'POST' });
    case 'PUT': return factory({ color: '#ffbf00', text: 'PUT' });
    case 'DELETE': return factory({ color: '#F04134', text: 'DELETE' });
    default: return factory({ color: '#666666', text: method && method.toUpperCase() });
  }
};

Method.color = (method) => {
  switch (method && method.toUpperCase()) {
    case 'GET': return '#00A854';
    case 'POST': return '#108ee9';
    case 'PUT': return '#ffbf00';
    case 'DELETE': return '#F04134';
    default: return '#666666';
  }
};

Method.propTypes = {
  method: React.PropTypes.string.isRequired,
  simple: React.PropTypes.bool,
};

export default Method;
