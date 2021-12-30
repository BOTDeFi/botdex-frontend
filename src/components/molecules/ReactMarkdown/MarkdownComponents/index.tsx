/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NormalComponents, SpecialComponents } from 'react-markdown/lib/ast-to-react';

import './MarkdownComponents.scss';

const Title: React.FC<any> = ({ node, ...props }) => {
  /* eslint-disable jsx-a11y/heading-has-content */
  return <h4 className="markdown-components__title" {...props} />;
};

const Text: React.FC<any> = ({ node, ...props }) => {
  return <p className="markdown-components__text" {...props} />;
};

const Table: React.FC<any> = ({ node, ...props }) => {
  return <table className="markdown-components__table" {...props} />;
};

const OrderedList: React.FC<any> = ({ node, ordered, ...props }) => {
  // BUG: ordered from library is not what React ol.ordered type is
  return <ol className="markdown-components__list" ordered={ordered.toString()} {...props} />;
};

const UnorderedList: React.FC<any> = ({ node, ordered, ...props }) => {
  // BUG: ordered from library is not what React ol.ordered type is
  return <ul className="markdown-components__list" ordered={ordered.toString()} {...props} />;
};

const Pre: React.FC<any> = ({ node, ...props }) => {
  return <pre className="markdown-components__pre" {...props} />;
};

const Blockquote: React.FC<any> = ({ node, ...props }) => {
  return <blockquote className="markdown-components__blockquote" {...props} />;
};

const markdownComponents: Partial<NormalComponents & SpecialComponents> = {
  h1: Title,
  h2: Title,
  h3: Title,
  h4: Title,
  h5: Title,
  h6: Title,
  p: Text,
  table: Table,
  ol: OrderedList,
  ul: UnorderedList,
  pre: Pre,
  blockquote: Blockquote,
};

export default markdownComponents;
