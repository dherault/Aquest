import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';

import Story from '../../../components/Story';

class StoriesList extends Component {

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

    const { edges, pageInfo } = viewer.stories;

    return (
      <div className="cct">
        <strong className="has-white-color" style={{ marginBottom: '1rem' }}>
          {`${viewer.storyCount} Stor${viewer.storyCount > 1 ? 'ies' : 'y'}`}
        </strong>

        {edges.map(e => (
          <div key={e.node.id} style={{ marginBottom: '2rem' }}>
            <Story story={e.node} />
          </div>
        ))}

        {pageInfo.hasNextPage && (
          <button onClick={() => this.loadMore()}>Load more stories</button>
        )}
      </div>
    );
  }
}

export default createPaginationContainer(
  StoriesList,
  {
    viewer: graphql`
      fragment StoriesList_viewer on User {
        id
        storyCount
        stories(
          first: $count
          after: $cursor
        ) @connection(key: "viewer_stories") {
          edges {
            node {
              id
              ...Story_story
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
      return props.viewer && props.viewer.stories;
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
      query StoriesListPaginationQuery(
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...StoriesList_viewer
        }
      }
    `,
  }
);
