import React from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';

const Footer = () => (
  <footer className="container has-text-centered has-color-white" style={{ marginTop: 24 }}>
    <small>
      <p>
        <strong>Aquest</strong> by <a>David Hérault</a>.
          The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          The website content is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
        </p>
        <p>
          <a className="icon" href="https://github.com/dherault/aquest">
            <i className="fa fa-github" />
          </a>
        </p>
    </small>
  </footer>
);

export default Footer;
