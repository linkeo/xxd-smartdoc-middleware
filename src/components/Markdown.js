import React from 'react';
import marked from 'marked';
import './Markdown.less';

/* eslint react/no-danger: 0 */

const Markdown = ({ className, content }) => {
  return (
    <div
      className={`component-markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: marked(content || '') }}
    />
  );
};

export default Markdown;
