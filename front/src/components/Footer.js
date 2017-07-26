import React from 'react';
// import { Link } from 'react-router-dom';

const _part = {
  marginBottom: '1rem',
};

const Footer = ({ invert }) => {
  let className = 'container has-text-centered';

  if (invert) className += ' has-white-color';

  return (
    <footer className={className}>
      <small>
        <div style={_part}>
          <strong>Aquest</strong> by <a>David Hérault</a>.
          The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          The website content is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
        </div>
        <div style={_part}>
          <a className="icon" href="https://github.com/dherault/aquest">
            <i className="fa fa-github" />
          </a>
        </div>
      </small>
    </footer>
  );
};

export default Footer;
