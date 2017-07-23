import React from 'react';
// import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import DiskImage from './DiskImage';

const sSearch = {
  display: 'flex',
  alignItems: 'center',
  height: 52,
  position: 'absolute',
  top: 0,
  left: '25%',
  right: '25%',
  zIndex: 999,
};

const NavBar = ({ viewer }) => (
  <div>
    <div style={sSearch}>
      <input className="input has-text-centered" type="text" placeholder="🔍 Search" />
    </div>

    <nav className="navbar" style={{ boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.75)' }}>

      <DiskImage size="small" linkTo="/" className="navbar-item" />
      <DiskImage size="small" linkTo="/vocations" className="navbar-item" />

      <div className="navbar-menu" style={{ flexDirection: 'row-reverse' }}>
        <DiskImage size="small" linkTo="/" className="navbar-item" />
        <div style={{ height: 2, width: 32, backgroundColor: 'LightGrey', marginTop: 24 }} />
        <DiskImage size="small" linkTo="/" className="navbar-item" />
        <DiskImage size="small" linkTo="/" className="navbar-item" />
        <DiskImage size="small" linkTo="/" className="navbar-item" />
        <DiskImage size="small" linkTo="/" className="navbar-item" />
      </div>
    </nav>
  </div>
);

export default createFragmentContainer(NavBar, graphql`
  fragment NavBar_viewer on User {
    id
    pseudo
  }
`);
