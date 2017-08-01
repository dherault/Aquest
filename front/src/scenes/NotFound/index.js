import React from 'react';
import { Link } from 'react-router-dom';

import Footer from '../../components/Footer';

const NotFound = () => (
  <div className="y8 has-screen-height">
    <div className="y5" style={{ flexGrow: 1 }}>
      <strong>Page not found</strong>
      <br />
      <Link to="/">Home</Link>
    </div>
    <Footer />
  </div>
);

export default NotFound;
