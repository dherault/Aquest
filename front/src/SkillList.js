// import './Skills.css';
import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import createSkill from './mutations/CreateSkillMutation';

class SkillList extends Component {
  state = { label: '' }

  render() {
    const { individuals } = this.props;

    if (!(individuals && individuals.skills)) return console.log('no Skills props') || null;

    const { label } = this.state;
    const { edges } = individuals.skills;

    return (
      <div className="Skills">
        <h1>Skills</h1>
        <strong>{`${edges.length} skills`}</strong>

        <input type="text" value={label} onChange={e => this.setState({ label: e.target.value })} />
        <button onClick={() => createSkill(this.state, individuals)}>Create</button>

        <ol>
          {edges.map(s => <li key={s.node.id}>{s.node.label}</li>)}
        </ol>
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
`);
