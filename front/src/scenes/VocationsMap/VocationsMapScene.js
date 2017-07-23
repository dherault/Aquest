import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import createVocation from '../../mutations/CreateVocationMutation';
import createVocationInstance from '../../mutations/CreateVocationInstanceMutation';

import Footer from '../../components/Footer';

class VocationsMapScene extends Component {
  state = { label: '' }

  render() {
    const { individuals, viewer } = this.props;
    const { label } = this.state;

    const viewerVocations = [];
    const nonUserVocations = [];
    const viewerVocationIds = viewer.vocationInstances.edges.map(e => e.node.vocation.id);

    individuals.vocations.edges.forEach(e => {
      if (viewerVocationIds.includes(e.node.id)) viewerVocations.push(e.node);
      else nonUserVocations.push(e.node);
    });

    return (
      <div className="Vocations" style={{ textAlign: 'center' }}>
        <h1>{`${individuals.vocations.edges.length} Vocations`}</h1>

        <input type="text" value={label} onChange={e => this.setState({ label: e.target.value })} />
        <button onClick={() => createVocation(this.state.label, individuals)}>Create</button>

        <h2>My vocations</h2>
        <div>
          {viewerVocations.map(({ id, label }) =>
            <div key={id}>
              {label}
            </div>
          )}
        </div>

        <h2>Other vocations</h2>
        <div>
          {nonUserVocations.map(({ id, label }) =>
            <div key={id} onClick={() => createVocationInstance(id, viewer)}>
              {label}
            </div>
          )}
        </div>

        <Footer viewer={viewer} />
      </div>
    );
  }
}

export default createFragmentContainer(VocationsMapScene, graphql`
  fragment VocationsMapScene_individuals on Individuals {
    id
    vocations(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "individuals_vocations") {
      edges {
        node {
          id
          label
        }
      }
    }
  }

  fragment VocationsMapScene_viewer on User {
    id
    vocationInstances(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "viewer_vocationInstances") {
      edges {
        node {
          id
          level
          vocation {
            id
          }
        }
      }
    }

    ...Footer_viewer
  }

`);
