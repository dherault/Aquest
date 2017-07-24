import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';
import VocationInstanceShowcase from './VocationInstanceShowcase';

const vocationWingStyle = {
  width: `calc((100% - ${DiskImage.sizes.large}px) / 2)`,
};

class UserShowcase extends Component {

  render() {
    const { user, onVocationInstanceClick } = this.props;
    const vocationInstances = user.vocationInstances.edges.map(e => e.node);

    return (
      <div className="cct has-color-white has-full-width">
        <div className="rcc has-full-width">

          <div className="crc" style={vocationWingStyle}>
            {!!vocationInstances[0] && (
              <VocationInstanceShowcase
                isLeft
                onDiskImageClick={() => onVocationInstanceClick(vocationInstances[0].id)}
                vocationInstance={vocationInstances[0]}
              />
            )}
            {!!vocationInstances[1] && (
              <VocationInstanceShowcase
                isLeft
                onDiskImageClick={() => onVocationInstanceClick(vocationInstances[1].id)}
                vocationInstance={vocationInstances[1]}
              />
            )}
          </div>

          <DiskImage
            size="large"
            src={user.profileImageUrl}
            onClick={() => onVocationInstanceClick(vocationInstances[0].id)}
            style={{ margin: '0px 4rem' }}
          />

          <div className="clc" style={vocationWingStyle}>
            {!!vocationInstances[2] && (
              <VocationInstanceShowcase
                onDiskImageClick={() => onVocationInstanceClick(vocationInstances[2].id)}
                vocationInstance={vocationInstances[2]}
              />
            )}
            {!!vocationInstances[3] && (
              <VocationInstanceShowcase
                onDiskImageClick={() => onVocationInstanceClick(vocationInstances[3].id)}
                vocationInstance={vocationInstances[3]}
              />
            )}
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
