import React from 'react';
import Immutable from 'immutable';

require('./style.sass');

let verticalBound = 0;

export default class ActivityChart extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  _style(number) {
    const transform = `scaleY(${number / verticalBound})`;

    return {
      transform,
      WebkitTransform: transform,
      MozTransfrom: transform,
      MsTransform: transform,
    };
  }

  render() {
    const dataPoints = this.props.data.toArray();

    if (dataPoints.length) {
      verticalBound = this.props.data.max() * 1.3;
    } else {
      verticalBound = 0;
    }

    return (
      <div className="ActivityChartComponent">
        {dataPoints.map((number, index) => <div
            key={index}
            className="ActivityChartComponent-bar"
            style={this._style(number)}
          />)}
      </div>
    );
  }
}
