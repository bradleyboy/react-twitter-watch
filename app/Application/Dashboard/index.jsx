import React from 'react';
import HashtagList from '../HashtagList';
import TweetList from '../TweetList';
import Activity from '../Activity';
import cx from 'classnames';

require('./style.sass');

export default class Dashboard extends React.Component {
  render() {
    const classes = cx({
      DashboardComponent: true,
      'is-hidden': !this.props.filter.length,
      'is-waiting': this.props.filter.length && this.props.tweetCount === 0,
    });

    if (this.props.tweetCount === 0) {
      return (
        <main className={classes}>
          {`Waiting for tweets matching "${this.props.filter}"`}
        </main>
      );
    }

    return (
      <main className={classes}>
        <Activity count={this.props.tweetCount} trend={this.props.timeData} />

        <TweetList tweets={this.props.randomTweets} />

        <HashtagList data={this.props.hashtags} />
      </main>
    );
  }
}
