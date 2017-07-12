import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import './User.css';

class User extends Component {
  state = {}

  updateState = key => e => this.setState({ [key]: e.target.value })

  submitCommit = e => {
    e.preventDefault();
  }

  componentWillMount() {
    if (!this.props.user.acquiredSkills.edges.length) return;

    this.setState({
      commitDescription: '',
      commitSkillId: this.props.user.acquiredSkills.edges[0].node.id,
    });
  }

  render() {
    const { user } = this.props;
    const { commitDescription, commitSkillId } = this.state;
    const acquiredSkillNodes = user.acquiredSkills.edges.map(e => e.node);

    return (
      <div className="User">
        <section>
          <img className="User-picture" alt="" src={user.pictureUrl} />

          <h1>{user.fisrtName} {user.lastName}</h1>

          <p className="User-intro">
            {user.intro}
          </p>
        </section>

        <section>
          <h2>Skill list</h2>
          <ul>
            {acquiredSkillNodes.map(n => n.label)}
          </ul>
        </section>

        {!!acquiredSkillNodes.length && (
          <section>
            <form onSubmit={this.submitCommit}>
              <input type="text" value={commitDescription} onChange={this.updateState('commitDescription')}/>
              <select value={commitSkillId} onChange={this.updateState('commitSkillId')}>
                {acquiredSkillNodes.map(n => (
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

export default createFragmentContainer(User, graphql`
  fragment User_user on Person {
    firstName
    lastName
    intro
    pictureUrl
    acquiredSkills(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "User_acquiredSkills") {
      edges {
        node {
          id
          label
        }
      }
    }
  }
`);
