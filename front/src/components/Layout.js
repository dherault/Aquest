import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import NavBar from './NavBar';
import Footer from './Footer';

const _layout = {
  minHeight: '100vh',
};

const _content = {
  backgroundPosition: 'center',
  backgroundSize: '100% auto',
  backgroundRepeat: 'no-repeat',
  overflowY: 'auto',
  overflowX: 'hidden',
};

const Layout = ({ viewer, backgroundImageUrl, backgroundColor = 'LightGrey', children }) => {

  const __content = {
    ..._content,
    backgroundColor,
    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : null,
  };

  return (
    <div className="cstt" style={_layout}>

      <NavBar viewer={viewer} />

      <div className="cstt has-flex-grow" style={__content}>

        <div className="cstt has-flex-grow">
          {children}
        </div>

        <Footer invert />
      </div>
    </div>
  );
};

export default createFragmentContainer(Layout, graphql`
  fragment Layout_viewer on User {
    ...NavBar_viewer
  }
`);
