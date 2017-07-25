import React from 'react';
import { Link } from 'react-router-dom';

import Footer from '../../components/Footer';

const NotFound = () => (
  <div className="cct has-screen-height">
    <div className="ccc" style={{ flexGrow: 1 }}>
      <strong>Page not found</strong>
      <br />
      <Link to="/">Home</Link>
    </div>
    <Footer />
  </div>
);

export default NotFound;
