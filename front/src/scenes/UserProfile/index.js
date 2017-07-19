import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import './index.css';

import CommitCreationForm from './components/CommitCreationForm';

class UserProfile extends Component {

  render() {
    const { user } = this.props;
    const skillInstances = user.skillInstances.edges.map(e => e.node);
    const commits = user.commits.edges.map(e => e.node);

    return (
      <div className="UserProfile">
        <section>
          <img className="UserProfile-picture" alt="" src={user.pictureUrl} />

          <h1>{user.fisrtName} {user.lastName}</h1>

          <p className="UserProfile-intro">
            {user.intro}
          </p>
        </section>

        <section>
          <h2>Skill list</h2>
          {skillInstances.map(({ id, level, skill }) => (
            <div key={id}>
              <h3>{skill.label} (level {level})</h3>
              {commits.filter(c => c.skill.id === skill.id).map(c => (
                <div key={c.id}>
                  <strong>{c.label}</strong>
                  &nbsp;
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        {!!skillInstances.length && <CommitCreationForm user={user} />}
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

    commits(first: 2147483647) @connection(key: "user_commits") {
      edges {
        node {
          id
          label
          createdAt
          skill {
            id
          }
        }
      }
    }
  }
`);
