// import './Skills.css';
import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import createSkill from './mutations/CreateSkillMutation';
import toggleSkill from './mutations/ToggleSkillMutation';

class SkillList extends Component {
  state = { label: '' }

  render() {
    const { individuals, user } = this.props;

    if (!(individuals && individuals.skills)) return console.log('no Skills props') || null;
    console.log('user', user);
    const { label } = this.state;
    const { edges } = individuals.skills;

    const acquiredSkillIds = user.acquiredSkills.edges.map(({ node }) => node.id);

    return (
      <div className="Skills" style={{ textAlign: 'center' }}>
        <h1>Skills</h1>
        <strong>{`${edges.length} skills`}</strong>

        <input type="text" value={label} onChange={e => this.setState({ label: e.target.value })} />
        <button onClick={() => createSkill(this.state, individuals)}>Create</button>

        <ul>
          {edges.map(({ node: { id, label } }) =>
            <li
              key={id}
              onClick={() => toggleSkill(id, user)}
              style={{ fontWeight: acquiredSkillIds.includes(id) ? 'bold' : 'normal' }}
            >
              {label}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default createFragmentContainer(SkillList, graphql`
  fragment SkillList_individuals on Individuals {
    id
    skills(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "SkillList_skills") {
      edges {
        node {
          id
          label
        }
      }
    }
  }
  fragment SkillList_user on Person {
    id
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
