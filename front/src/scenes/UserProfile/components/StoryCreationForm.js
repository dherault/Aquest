import React, { Component } from 'react';
import createStory from '../../../mutations/CreateStoryMutation';

class StoryCreationForm extends Component {
  state = {}

  updateState = key => e => this.setState({ [key]: e.target.value })

  submitStory = e => {
    e.preventDefault();

    const { viewer } = this.props;
    const { storyVocationId, storyLabel } = this.state;

    createStory(storyVocationId, storyLabel, viewer);
  }

  componentWillMount() {
    this.setState({
      storyLabel: '',
      storyVocationId: this.props.viewer.vocationInstances.edges[0].node.vocation.id,
    });
  }

  render() {
    const { viewer } = this.props;
    const { storyLabel, storyVocationId } = this.state;

    return (
      <form onSubmit={this.submitStory}>
        <input type="text" value={storyLabel} onChange={this.updateState('storyLabel')}/>
        <select value={storyVocationId} onChange={this.updateState('storyVocationId')}>
          {viewer.vocationInstances.edges.map(e => (
            <option key={e.node.vocation.id} value={e.node.vocation.id}>
              {e.node.vocation.label}
            </option>
          ))}
        </select>
        <input type="submit" value="Story" />
      </form>
    );
  }
}

export default StoryCreationForm;
