import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import './index.css';

import CommitCreationForm from './components/CommitCreationForm';
import CommitsList from './components/CommitsList';

class UserProfile extends Component {

  render() {
    const { user } = this.props;
    const skillInstances = user.skillInstances.edges.map(e => e.node);

    return (
      <div className="UserProfile">
        <section>
          <img className="UserProfile-picture" alt="" src={user.pictureUrl} />

          <h1>{user.pseudo}</h1>

          <p className="UserProfile-intro">
            {user.intro}
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

        {!!skillInstances.length && <CommitCreationForm user={user} />}

        <CommitsList user={user} />
      </div>
    );
  }
}

export default createFragmentContainer(UserProfile, graphql`
  fragment UserProfile_user on Person {
    id
    pseudo
    intro
    pictureUrl

    skillInstances(first: 2147483647) @connection(key: "user_skillInstances") {
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
    ...CommitsList_user
  }
`);
