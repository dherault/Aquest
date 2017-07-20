import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import './index.css';

import CommitCreationForm from './components/CommitCreationForm';
import CommitsList from './components/CommitsList';

class UserProfile extends Component {

  render() {
    const { viewer } = this.props;
    const skillInstances = viewer.skillInstances.edges.map(e => e.node);

    return (
      <div className="UserProfile">
        <section>
          <img className="UserProfile-picture" alt="" src={viewer.pictureUrl} />

          <h1>{viewer.pseudo}</h1>

          <p className="UserProfile-intro">
            {viewer.intro}
          </p>
        </section>

        <section>
          <h2>Skill list</h2>
          {skillInstances.map(({ id, level, skill }) => (
            <div key={id}>
              <h3>{skill.label} (level {level})</h3>
            </div>
          ))}
        </section>

        {!!skillInstances.length && <CommitCreationForm viewer={viewer} />}

        <CommitsList viewer={viewer} />
      </div>
    );
  }
}

export default createFragmentContainer(UserProfile, graphql`
  fragment UserProfile_viewer on User {
    id
    pseudo
    intro
    pictureUrl

    skillInstances(first: 2147483647) @connection(key: "viewer_skillInstances") {
      edges {
        node {
          id
          level
          skill {
            id
            label
          }
        }
      }
    }
    ...CommitsList_viewer
  }
`);
