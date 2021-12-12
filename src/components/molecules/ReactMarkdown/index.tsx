import React from 'react';
import ReactMarkdownLib, { Options } from 'react-markdown';
import gfm from 'remark-gfm';

import markdownComponents from './MarkdownComponents';

const ReactMarkdown: React.FC<Options> = (props) => {
  return <ReactMarkdownLib remarkPlugins={[gfm]} components={markdownComponents} {...props} />;
};

export default ReactMarkdown;
