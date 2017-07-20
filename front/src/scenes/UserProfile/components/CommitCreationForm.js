import React, { Component } from 'react';
import createCommit from '../../../mutations/CreateCommitMutation';

class CommitCreationForm extends Component {
  state = {}

  updateState = key => e => this.setState({ [key]: e.target.value })

  submitCommit = e => {
    e.preventDefault();

    const { viewer } = this.props;
    const { commitSkillId, commitLabel } = this.state;

    createCommit(commitSkillId, commitLabel, viewer);
  }

  componentWillMount() {
    this.setState({
      commitLabel: '',
      commitSkillId: this.props.viewer.skillInstances.edges[0].node.skill.id,
    });
  }

  render() {
    const { viewer } = this.props;
    const { commitLabel, commitSkillId } = this.state;

    return (
      <form onSubmit={this.submitCommit}>
        <input type="text" value={commitLabel} onChange={this.updateState('commitLabel')}/>
        <select value={commitSkillId} onChange={this.updateState('commitSkillId')}>
          {viewer.skillInstances.edges.map(e => (
            <option key={e.node.skill.id} value={e.node.skill.id}>
              {e.node.skill.label}
            </option>
          ))}
        </select>
        <input type="submit" value="Commit" />
      </form>
    );
  }
}

export default CommitCreationForm;
