import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import createSkill from '../../mutations/CreateSkillMutation';
import createSkillInstance from '../../mutations/CreateSkillInstanceMutation';

import Footer from '../../components/Footer';

class SkillsRegistryScene extends Component {
  state = { label: '' }

  render() {
    const { individuals, viewer } = this.props;
    const { label } = this.state;

    const viewerSkills = [];
    const nonUserSkills = [];
    const viewerSkillIds = viewer.skillInstances.edges.map(e => e.node.skill.id);

    individuals.skills.edges.forEach(e => {
      if (viewerSkillIds.includes(e.node.id)) viewerSkills.push(e.node);
      else nonUserSkills.push(e.node);
    });

    return (
      <div className="Skills" style={{ textAlign: 'center' }}>
        <h1>{`${individuals.skills.edges.length} Skills`}</h1>

        <input type="text" value={label} onChange={e => this.setState({ label: e.target.value })} />
        <button onClick={() => createSkill(this.state.label, individuals)}>Create</button>

        <h2>My skills</h2>
        <div>
          {viewerSkills.map(({ id, label }) =>
            <div key={id}>
              {label}
            </div>
          )}
        </div>

        <h2>Other skills</h2>
        <div>
          {nonUserSkills.map(({ id, label }) =>
            <div key={id} onClick={() => createSkillInstance(id, viewer)}>
              {label}
            </div>
          )}
        </div>

        <Footer viewer={viewer} />
      </div>
    );
  }
}

export default createFragmentContainer(SkillsRegistryScene, graphql`
  fragment SkillsRegistryScene_individuals on Individuals {
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

  fragment SkillsRegistryScene_viewer on User {
    id
    skillInstances(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "viewer_skillInstances") {
      edges {
        node {
          id
          level
          skill {
            id
          }
        }
      }
    }

    ...Footer_viewer
  }

`);
