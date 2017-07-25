import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import createStory from '../../../mutations/CreateStoryMutation';

import DiskImage from '../../../components/DiskImage';
import Story from '../../../components/Story';

class StoryCreationForm extends Component {

  state = { label: '', shouldLevelUp: false }

  handleCheckboxChange = e => this.setState({ shouldLevelUp: e.target.checked })

  handleInputChange = e => {
    e.target.style.height = '1px';
    e.target.style.height = (e.target.scrollHeight + 2) + 'px';

    this.setState({ label: e.target.value });
  }

  submitStory = e => {
    e.preventDefault();

    const { viewer, onSubmit } = this.props;
    const { label, shouldLevelUp } = this.state;


    createStory(label, shouldLevelUp, this.getVocationInstance(), viewer);

    if (onSubmit) onSubmit();
  }

  getVocationInstance = () => {
    const { viewer, selectedVocationInstanceId } = this.props;

    return (viewer.vocationInstances.edges.find(e => e.node.id === selectedVocationInstanceId) || {}).node;
  }

  render() {
    const { label, shouldLevelUp, onSubmit } = this.state;

    const vocationInstance = this.getVocationInstance();

    // Should never happen, but params come from parent so we never know
    if (!vocationInstance) return null;

    return (
      <form onSubmit={this.submitStory} className="cct">
        <div>
          <Story.Layout>

            <Story.LayoutLeft>
              <DiskImage />
            </Story.LayoutLeft>

            <Story.LayoutRight>

              <Story.LayoutHeader>
                <strong className="has-black-color">{vocationInstance.vocation.label}</strong>
              </Story.LayoutHeader>

              <Story.LayoutContent>
                <textarea
                  ref={e => e && e.focus()}
                  value={label}
                  onChange={this.handleInputChange}
                  style={{ resize: 'none', marginBottom: '-2px' }}
                  className="has-no-margin has-full-width"
                />
              </Story.LayoutContent>

            </Story.LayoutRight>
          </Story.Layout>

          <input
            type="checkbox"
            checked={shouldLevelUp}
            onChange={this.handleCheckboxChange}
            style={{ marginLeft: '1rem' }}
          />
          <span className="label-inline has-white-color">I'm worthy of leveling up</span>
        </div>
        <div className="rcc">
          <input type="submit" value="This is my story" />
          <input type="button" value="Cancel" onClick={onSubmit} style={{ marginLeft: '1rem' }} />
        </div>
      </form>
    );
  }
}

export default createFragmentContainer(StoryCreationForm, graphql`
  fragment StoryCreationForm_viewer on User {
    id
    vocationInstances(first: 4) @connection(key: "user_vocationInstances") {
      edges {
        node {
          id
          vocation {
            id
            label
          }
        }
      }
    }
  }
`);
