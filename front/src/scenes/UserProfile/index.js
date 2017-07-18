import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import createCommit from './mutations/CreateCommitMutation';
import './index.css';

class UserProfile extends Component {
  state = {}

  updateState = key => e => this.setState({ [key]: e.target.value })

  submitCommit = e => {
    e.preventDefault();

    const { user } = this.props;
    const { commitSkillId, commitLabel } = this.state;

    createCommit(commitSkillId, commitLabel, user);
  }

  componentWillMount() {
    if (!this.props.user.skills.edges.length) return;

    this.setState({
      commitLabel: '',
      commitSkillId: this.props.user.skills.edges[0].node.id,
    });
  }

  render() {
    const { user } = this.props;
    const { commitLabel, commitSkillId } = this.state;
    const skills = user.skills.edges.map(e => e.node);
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
          {skills.map(({ id, label }) => (
            <div key={id}>
              <h3>{label}</h3>
              {commits.filter(c => c.skill.id === id).map(c => (
                <div key={c.id}>
                  <strong>{c.label}</strong>
                  &nbsp;
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        {!!skills.length && (
          <section>
            <form onSubmit={this.submitCommit}>
              <input type="text" value={commitLabel} onChange={this.updateState('commitLabel')}/>
              <select value={commitSkillId} onChange={this.updateState('commitSkillId')}>
                {skills.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
              <input type="submit" value="Commit" />
            </form>
          </section>
        )}


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
