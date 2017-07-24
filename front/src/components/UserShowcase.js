import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import DiskImage from './DiskImage';
import VocationInstanceShowcase from './VocationInstanceShowcase';

const vocationWingStyle = {
  width: `calc((100% - ${DiskImage.sizes.large}px) / 2)`,
};

class UserShowcase extends Component {

  render() {
    const { user } = this.props;
    const vocationInstances = user.vocationInstances.edges.map(e => e.node);

    return (
      <div className="cct has-color-white has-full-width">
        <div className="rcc has-full-width">

          <div className="crc" style={vocationWingStyle}>
            {!!vocationInstances[0] && <VocationInstanceShowcase isLeft vocationInstance={vocationInstances[0]} />}
            {!!vocationInstances[1] && <VocationInstanceShowcase isLeft vocationInstance={vocationInstances[1]} />}
          </div>

          <DiskImage size="large" src={user.profileImageUrl} style={{ margin: '0px 3rem' }}/>

          <div className="clc" style={vocationWingStyle}>
            {!!vocationInstances[2] && <VocationInstanceShowcase vocationInstance={vocationInstances[2]} />}
            {!!vocationInstances[3] && <VocationInstanceShowcase vocationInstance={vocationInstances[3]} />}
          </div>

        </div>

        <h1>
          {user.pseudo}
        </h1>
        <p>
          {user.description}
        </p>
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
