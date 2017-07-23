import React, { Component } from 'react';
import createCommit from '../../../mutations/CreateCommitMutation';

class CommitCreationForm extends Component {
  state = {}

  updateState = key => e => this.setState({ [key]: e.target.value })

  submitCommit = e => {
    e.preventDefault();

    const { viewer } = this.props;
    const { commitVocationId, commitLabel } = this.state;

    createCommit(commitVocationId, commitLabel, viewer);
  }

  componentWillMount() {
    this.setState({
      commitLabel: '',
      commitVocationId: this.props.viewer.vocationInstances.edges[0].node.vocation.id,
    });
  }

  render() {
    const { viewer } = this.props;
    const { commitLabel, commitVocationId } = this.state;

    return (
      <form onSubmit={this.submitCommit}>
        <input type="text" value={commitLabel} onChange={this.updateState('commitLabel')}/>
        <select value={commitVocationId} onChange={this.updateState('commitVocationId')}>
          {viewer.vocationInstances.edges.map(e => (
            <option key={e.node.vocation.id} value={e.node.vocation.id}>
              {e.node.vocation.label}
            </option>
          ))}
        </select>
        <input type="submit" value="Commit" />
      </form>
    );
  }
}

export default CommitCreationForm;
