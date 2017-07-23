import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import CommitCreationForm from './components/CommitCreationForm';
import CommitsList from './components/CommitsList';

import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

class UserProfileScene extends Component {

  render() {
    const { viewer } = this.props;
    const vocationInstances = viewer.vocationInstances.edges.map(e => e.node);

    return (
      <div>
        <NavBar viewer={viewer} />
        <section>
          <img alt="" src={viewer.profileImageUrl} />

          <h1>
            {viewer.pseudo}
          </h1>

          <p>
            {viewer.bio}
          </p>
        </section>

        <section>
          <h2>Vocation list</h2>

          {vocationInstances.map(({ id, level, vocation }) => (
            <div key={id}>
              <h3>{vocation.label} (level {level})</h3>
            </div>
          ))}
        </section>

        {!!vocationInstances.length && <CommitCreationForm viewer={viewer} />}

        <CommitsList viewer={viewer} />

        <Footer viewer={viewer} />
      </div>
    );
  }
}

export default createFragmentContainer(UserProfileScene, graphql`
  fragment UserProfileScene_viewer on User {
    id
    pseudo
    bio
    profileImageUrl
    backgroundImageUrl

    vocationInstances(first: 2147483647) @connection(key: "viewer_vocationInstances") {
      edges {
        node {
          id
          level
          vocation {
            id
            label
          }
        }
      }
    }
    ...CommitsList_viewer
    ...Footer_viewer
  }
`);
