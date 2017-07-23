import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import CommitCreationForm from './components/CommitCreationForm';
import CommitsList from './components/CommitsList';

import NavBar from '../../components/NavBar';
import BackgroundImage from '../../components/BackgroundImage';
import DiskImage from '../../components/DiskImage';
import Footer from '../../components/Footer';

class UserProfileScene extends Component {

  render() {
    const { viewer } = this.props;
    const vocationInstances = viewer.vocationInstances.edges.map(e => e.node);

    return (
      <div>

        <BackgroundImage src={viewer.backgroundImageUrl}>
          <NavBar viewer={viewer} />
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <div>
              <DiskImage size="large" src={viewer.profileImageUrl} />
            </div>

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
          <Footer />
        </BackgroundImage>


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

    vocationInstances(first: 4) @connection(key: "viewer_vocationInstances") {
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
    ...NavBar_viewer
    ...CommitsList_viewer
  }
`);
