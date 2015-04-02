import React from 'react';
import Immutable from 'immutable';

require('./style.sass');

export default class HashtagList extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  render() {
    const items = [];

    this.props.data.forEach((count, hashtag) => {
      items.push(<div className="HashtagListComponent-item" key={hashtag}>
        <div className="HashtagListComponent-item-title">{hashtag}</div>
        <div className="HashtagListComponent-item-count">{count}</div>
      </div>);
    });

    // Fill so flex items are aligned top
    for (var i = 0; i < 10 - items.length; i++) {
      items.push(<div className="HashtagListComponent-item" key={i} />);
    }

    return (
      <div className="HashtagListComponent u-column">
        <h2 className="u-column-header">Hashtags</h2>

        <div className="HashtagListComponent-list">
          {items}
        </div>
      </div>
    );
  }
}
