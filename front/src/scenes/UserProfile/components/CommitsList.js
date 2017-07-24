import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import moment from 'moment';

import DiskImage from '../../../components/DiskImage';

const CommitItem = ({ commit }) => (
  <div className="box" style={{ width: '50%' }}>
    <article className="media">
      <figure className="media-left">
        <DiskImage />
      </figure>
      <div className="media-content">
        <div className="contentz">
          <p>
            <strong>{commit.vocation.label}</strong> <small>{moment(commit.createdAt).fromNow()}</small>
            <br />
            {commit.label}
          </p>
        </div>
      </div>
    </article>
  </div>
);

class CommitsList extends Component {

  loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return;

    this.props.relay.loadMore(
      10, // Fetch the next 10 feed items
      e => {
        console.log(e);
      },
    );
  }

  render() {
    const { viewer } = this.props;

    if (!viewer) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {viewer.commits.edges.map(e => <CommitItem commit={e.node} key={e.node.id} />)}
        <button onClick={() => this.loadMore()}>Load more</button>
      </div>
    );
  }
}

export default createPaginationContainer(
  CommitsList,
  {
    viewer: graphql`
      fragment CommitsList_viewer on User {
        id
        commits(
          first: $count
          after: $cursor
        ) @connection(key: "viewer_commits") {
          edges {
            node {
              id
              label
              createdAt
              vocation {
                id
                label
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.commits;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        // orderBy: fragmentVariables.orderBy,
      };
    },
    query: graphql`
      query CommitsListPaginationQuery(
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...CommitsList_viewer
        }
      }
    `,
  }
);