import React from 'react';
// import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import DiskImage from './DiskImage';

const sNav = {
  position: 'relative',
  height: '5rem',
  boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.75)',
  backgroundColor: 'white',
};

const sSearch = {
  height: '5rem',
  position: 'absolute',
  top: 0,
  left: '25%',
  right: '25%',
  zIndex: 999,
};

const sMenu = {
  height: '5rem',
  padding: '0.5rem',
};

const sl = {
  marginRight: '0.5rem',
};

const sr = {
  marginLeft: '0.5rem',
};

const NavBar = ({ viewer }) => (
  <div style={sNav}>

    <div className="rcc" style={sSearch}>
      <input
        type="text"
        placeholder="🔍 Search"
        className="has-text-centered has-no-margin"
      />
    </div>

    <nav className="rsbc" style={sMenu}>

      <div className="rlc">
        <DiskImage style={sl} size="small" linkTo="/" />
        <DiskImage style={sl} size="small" linkTo="/vocations" />
      </div>

      <div className="rxrc">
        <DiskImage style={sr} size="small" linkTo="/user" src={viewer.profileImageUrl} />
        <div style={{ height: 2, width: 32, backgroundColor: 'LightGrey', marginLeft: '0.5rem' }} />
        <DiskImage style={sr} size="small" linkTo="/" />
        <DiskImage style={sr} size="small" linkTo="/" />
        <DiskImage style={sr} size="small" linkTo="/" />
        <DiskImage style={sr} size="small" onClick={() => localStorage.removeItem('token') || (window.location.href = '/')} />
      </div>

    </nav>
  </div>
);

export default createFragmentContainer(NavBar, graphql`
  fragment NavBar_viewer on User {
    id
    profileImageUrl
  }
`);
