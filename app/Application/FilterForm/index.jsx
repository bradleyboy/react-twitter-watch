import React from 'react';
import cx from 'classnames';

require('./style.sass');

export default class FilterForm extends React.Component {
  render() {
    const classes = cx({
      FilterFormComponent: true,
      'is-full': !this.props.filter.length,
    });

    const label = `${this.props.filter.length ? 'Watching' : 'Watch'} Twitter for `;

    return (
      <form className={classes} onSubmit={this.props.onSubmit}>
        <span className="FilterFormComponent-label">{label}</span>
        <input autoFocus={true} type="text" ref="filter" defaultValue={this.props.filter} />
        <button type="submit">Watch</button>
      </form>
    );
  }
}
