import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';
import DiskImage from './DiskImage';

const sNav = {
  position: 'relative',
  height: '5rem',
  boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.75)',
  backgroundColor: 'white',
  zIndex: 998,
};

const sSearchInput = {
  height: '5rem',
  position: 'absolute',
  top: 0,
  left: '25%',
  right: '25%',
  zIndex: 999,
};

const sSearchResults = {
  position: 'absolute',
  top: '5rem',
  backgroundColor: 'white',
  left: 0,
  right: 0,
  height: 'calc(100vh - 5rem)',
  zIndex: 997,
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

class NavBar extends Component {

  state = { searchText: '' }

  handleSearchInputChange = e => this.setState({ searchText: e.target.value });

  render() {
    const { viewer } = this.props;
    const { searchText } = this.state;

    return (
      <div className="has-full-width">
        <nav style={sNav}>

          <div className="rcc" style={sSearchInput}>
            <input
              type="text"
              placeholder="🔍 Search"
              value={searchText}
              onChange={this.handleSearchInputChange}
              className="has-text-centered has-no-margin"
            />
          </div>

          <div className="rsbc" style={sMenu}>

            <div className="rlc">
              <DiskImage style={sl} size="small" linkTo="/" />
              <Link to="/vocations">
                <button>
                  Vocations
                </button>
              </Link>
            </div>

            <div className="rxrc">
              <DiskImage style={sr} size="small" linkTo="/user" src={viewer.profileImageUrl} />
              <div style={{ height: 2, width: 32, backgroundColor: 'LightGrey', marginLeft: '0.5rem' }} />
              <DiskImage style={sr} size="small" linkTo="/" />
              <DiskImage style={sr} size="small" linkTo="/" />
              <DiskImage style={sr} size="small" linkTo="/" />
              <DiskImage style={sr} size="small" onClick={() => localStorage.removeItem('token') || (window.location.href = '/')} />
            </div>

          </div>
        </nav>

        {!!searchText && (
          <div className="rcc" style={sSearchResults}>
            <h3>Feature not implemeted yet</h3>
          </div>
        )}

      </div>

    );
  }
}
export default createFragmentContainer(NavBar, graphql`
  fragment NavBar_viewer on User {
    id
    profileImageUrl
  }
`);
