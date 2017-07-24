import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import createStory from '../../../mutations/CreateStoryMutation';

class StoryCreationForm extends Component {
  state = { label: '', shouldLevelUp: false }

  handleInputChange = e => this.setState({ label: e.target.value })
  handleCheckboxChange = e => this.setState({ shouldLevelUp: e.target.checked })

  submitStory = e => {
    e.preventDefault();

    const { vocationInstance, viewer } = this.props;
    const { label, shouldLevelUp } = this.state;

    createStory(label, shouldLevelUp, vocationInstance, viewer);
  }

  render() {
    const { vocationInstance } = this.props;
    const { label, shouldLevelUp } = this.state;

    return (
      <form onSubmit={this.submitStory} className="cct">
        <strong>{vocationInstance.vocation.label}</strong>
        <textarea
          value={label}
          onChange={this.handleInputChange}
        />
        <input
          type="checkbox"
          checked={shouldLevelUp}
          onChange={this.handleCheckboxChange}
        />
        <input type="submit" value="Story" />
      </form>
    );
  }
}

export default createFragmentContainer(StoryCreationForm, graphql`
  fragment StoryCreationForm_viewer on User {
    id
  }
  fragment StoryCreationForm_vocationInstance on VocationInstance {
    id
    vocation {
      id
      label
    }
  }
`);
