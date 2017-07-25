import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';
import VocationInstanceShowcase from './VocationInstanceShowcase';

const vocationWingStyle = {
  width: `calc((100% - ${DiskImage.sizes.large}px) / 2)`,
};

class UserShowcase extends Component {

  renderVocationInstance(index) {
    const { user, setSelectedVocationInstanceId, selectedVocationInstanceId } = this.props;
    const vocationInstance = (user.vocationInstances.edges[index] || {}).node;

    if (!vocationInstance) return null;

    return (
      <VocationInstanceShowcase
        vocationInstance={vocationInstance}
        isLeft={index < 2}
        isDimmed={vocationInstance.id !== selectedVocationInstanceId}
        onDiskImageClick={() => setSelectedVocationInstanceId(vocationInstance.id)}
      />
    );
  }

  render() {
    const { user, setSelectedVocationInstanceId } = this.props;

    return (
      <div className="cct has-white-color has-full-width">
        <div className="rcc has-full-width">

          <div className="crc" style={vocationWingStyle}>
            {this.renderVocationInstance(0)}
            {this.renderVocationInstance(1)}
          </div>

          <DiskImage
            size="large"
            src={user.profileImageUrl}
            onClick={() => setSelectedVocationInstanceId(((user.vocationInstances.edges[0] || {}).node || {}).id)}
            style={{ margin: '0px 4rem' }}
          />

          <div className="clc" style={vocationWingStyle}>
            {this.renderVocationInstance(2)}
            {this.renderVocationInstance(3)}
          </div>

        </div>

        <h1 style={{ margin: '2.5rem 0px 1rem 0px' }}>
          {user.pseudo}
        </h1>
        <div>
          {user.description}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(UserShowcase, graphql`
  fragment UserShowcase_user on User {
    id
    pseudo
    description
    profileImageUrl

    vocationInstances(first: 4) @connection(key: "user_vocationInstances") {
      edges {
        node {
          id
          ...VocationInstanceShowcase_vocationInstance
        }
      }
    }
  }
`);
