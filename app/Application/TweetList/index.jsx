import React from 'react';
import Immutable from 'immutable';
import Tweet from '../Tweet';

require('./style.sass');

export default class TweetList extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.tweets, nextProps.tweets);
  }

  render() {
    return (
      <div className="TweetListComponent u-column">
        <h2 className="u-column-header">Random Tweets</h2>

        <div className="TweetListComponent-list">
          {this.props.tweets.toArray().map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
        </div>
      </div>
    );
  }
}
