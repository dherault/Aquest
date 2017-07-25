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
    const { user } = this.props;

    if (!user) return null;

    const { edges, pageInfo } = user.stories;

    return (
      <div className="cct">
        <strong className="has-white-color" style={{ marginBottom: '1rem' }}>
          {`${user.storyCount} Stor${user.storyCount > 1 ? 'ies' : 'y'}`}
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
    user: graphql`
      fragment StoriesList_user on User {
        id
        pseudo
        storyCount
        stories(
          first: $count
          after: $cursor
        ) @connection(key: "user_stories") {
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
      return props.user && props.user.stories;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        pseudo: props.user.pseudo,
        count,
        cursor,
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        // orderBy: fragmentVariables.orderBy,
      };
    },
    query: graphql`
      query StoriesListPaginationQuery(
        $pseudo: String!
        $count: Int!
        $cursor: String
      ) {
        individuals {
          user(pseudo: $pseudo) {
            ...StoriesList_user
          }
        }
      }
    `,
  }
);
