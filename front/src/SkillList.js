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

    const { label } = this.state;
    const { edges } = individuals.skills;

    const userSkillIds = user.skills.edges.map(({ node }) => node.id);

    return (
      <div className="Skills" style={{ textAlign: 'center' }}>
        <h1>{`${edges.length} Skills`}</h1>

        <input type="text" value={label} onChange={e => this.setState({ label: e.target.value })} />
        <button onClick={() => createSkill(this.state.label, individuals)}>Create</button>

        <div>
          {edges.map(({ node: { id, label } }) =>
            <div
              key={id}
              onClick={() => toggleSkill(id, user)}
              style={{ fontWeight: userSkillIds.includes(id) ? 'bold' : 'normal' }}
            >
              {label}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(SkillList, graphql`
  fragment SkillList_individuals on Individuals {
    id

    skills(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "individuals_skills") {
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
    skillInstances(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "user_skillInstances") {
      edges {
        node {
          id
          skill {
            id
          }
        }
      }
    }
  }
`);
