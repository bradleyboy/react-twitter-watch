import React from 'react';
import ActivityChart from './ActivityChart';

require('./style.sass');

export default class Activity extends React.Component {
  _format() {
    return window.Intl ? new Intl.NumberFormat().format(this.props.count) : this.props.count;
  }

  render() {
    return (
      <div className="ActivityComponent u-column">
        <h2 className="u-column-header">Activity</h2>

        <div className="u-column-main">
          <ActivityChart data={this.props.trend} />
          <div className="ActivityComponent-counter">
            <h2>{this._format()}</h2>
            <p>Tweets processed</p>
          </div>
        </div>
      </div>
    );
  }
}
