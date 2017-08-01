import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';

const sNav = {
  position: 'relative',
  height: '5rem',
  boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.50)',
  backgroundColor: 'white',
  zIndex: 998,
};

const sSearchInput = {
  height: '5rem',
  position: 'absolute',
  top: 0,
  left: '30%',
  right: '30%',
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
  padding: '0.5rem 2rem',
};

const sl = {
  marginRight: '0.5rem',
};

const sMenuItem = {
  margin: '0 0.5rem',
};

class NavBar extends Component {

  state = { searchText: '', isMenuOpen: false }

  handleSearchInputChange = e => this.setState({ searchText: e.target.value });
  handleMenuToggle = () => this.setState({ isMenuOpen: !this.state.isMenuOpen });

  render() {
    const { viewer } = this.props;
    const { searchText, isMenuOpen } = this.state;

    const viewerProfileLocation = `/~${window.encodeURIComponent(viewer.pseudo)}`;

    return (
      <div>
        <nav style={sNav}>

          <div className="x5" style={sSearchInput}>
            <input
              type="text"
              placeholder="🔍 Search"
              value={searchText}
              onChange={this.handleSearchInputChange}
              className="has-text-centered has-no-margin hide-placeholder-on-focus"
            />
          </div>

          <div className="x5bs" style={sMenu}>

            <div className="x4">
              <DiskImage style={sl} linkTo="/" />
            </div>

            <div className="x69">
              <div
                title="menu"
                className="has-no-select has-cursor-pointer has-grey-color has-no-focus-outline"
                role="button"
                tabIndex={0}
                onClick={this.handleMenuToggle}
              >
                {isMenuOpen ? '🗙' : '•••'}
              </div>
              {isMenuOpen && (
                <div className="x69 has-grey-color">
                  <Link to="/settings">
                    <i
                      title="settings"
                      className="fa fa-cog has-cursor-pointer has-no-focus-outline"
                      role="button"
                      style={sMenuItem}
                    />
                  </Link>
                  <i
                    title="customize profile"
                    className="fa fa-paint-brush has-cursor-pointer has-no-focus-outline"
                    role="button"
                    tabIndex={0}
                    style={sMenuItem}
                  />
                  <i
                    title="sign out"
                    className="fa fa-sign-out has-cursor-pointer has-no-focus-outline"
                    role="button"
                    tabIndex={0}
                    style={sMenuItem}
                    onClick={() => localStorage.removeItem('token') || (window.location.href = '/')}
                  />
                </div>
              )}
              <DiskImage
                linkTo={viewerProfileLocation}
                src={viewer.profileImageUrl}
                style={{ margin: '0 1rem' }}
              />
              <Link to="/vocations" style={{ marginTop: '0.75rem' }}>
                <button className="button button-outline">
                  Vocations
                </button>
              </Link>
            </div>

          </div>
        </nav>

        {!!searchText && (
          <div className="x5" style={sSearchResults}>
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
    pseudo
    profileImageUrl
  }
`);
