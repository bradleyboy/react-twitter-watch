import React from 'react';
import WebSocket from 'ws';
import Immutable from 'immutable';
import FilterForm from './FilterForm';
import Dashboard from './Dashboard';

let hashtagMap = new Immutable.Map({});
let tweetList = new Immutable.List([]);
let timeList = new Immutable.List([]);

require('./style.sass');

export default class Application extends React.Component {
  constructor() {
    this.state = {
      filter: location.hash.replace(/^#/, ''),
      tweetCount: 0,
      hashtags: new Immutable.Map({}),
      timeData: new Immutable.List([]),
      randomTweets: new Immutable.List([]),
    };

    this._filter = this._filter.bind(this);
    this._setFilter = this._setFilter.bind(this);
  }

  componentWillMount() {
    window.addEventListener('hashchange', () => {
      const hash = location.hash.replace(/^#/, '');

      if (hash.length && this.state.filter !== hash) {
        this._setFilter(hash);
        this.refs.form.refs.filter.getDOMNode().value = hash;
      }
    });

    this.socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

    const getMarker = () => Math.floor(+Date.now() / 1000);
    let lastMarker = getMarker();

    this.socket.onopen = () => {
      if (this.state.filter.length) {
        this.socket.send(this.state.filter);
      }
    };

    this.socket.onmessage = (event) => {
      const { filter, tweet } = JSON.parse(event.data);

      if (filter === this.state.filter) {
        const tweetCount = this.state.tweetCount + 1;
        const marker = getMarker();

        if (!tweet.retweeted_status && (tweetList.size === 0 || marker - Number(tweetList.first().timestamp_ms / 1000) > 3)) {
          tweetList = tweetList.unshift(tweet).take(5);
        }

        if (marker - lastMarker > 2 || !timeList.size) {
          timeList = timeList.push(1).takeLast(31);
          lastMarker = marker;
        } else {
          timeList = timeList.update(timeList.size - 1, (value) => value + 1);
        }

        tweet.entities.hashtags.forEach((hashtag) => {
          hashtagMap = hashtagMap.update(hashtag.text, 1, (value) => value + 1);
        });

        const hashtags = hashtagMap
                          .sort()
                          .reverse()
                          .take(10);

        this.setState({
          tweetCount,
          hashtags,
          randomTweets: tweetList,
          timeData: timeList.butLast(),
        });
      }
    };
  }

  _setFilter(filter) {
    hashtagMap = hashtagMap.clear();
    tweetList = new Immutable.List([]);
    timeList = new Immutable.List([]);

    this.setState({
      filter,
      tweetCount: 0,
      randomTweets: tweetList,
      hashtags: hashtagMap,
      timeData: timeList,
    });

    this.socket.send(filter);

    location.hash = filter;
  }

  _filter(e) {
    e.preventDefault();

    const filterInput = this.refs.form.refs.filter.getDOMNode();

    filterInput.blur();

    this._setFilter(filterInput.value);
  }

  render() {
    return <div className="ApplicationComponent">
      <FilterForm ref="form" onSubmit={this._filter} filter={this.state.filter} />

      <Dashboard {...this.state} />
    </div>;
  }
}
