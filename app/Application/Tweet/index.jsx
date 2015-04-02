import React from 'react';
import twitter from 'twitter-text';

require('./style.sass');

export default class Tweet extends React.Component {
  _processTweet() {
    return twitter.autoLink(this.props.tweet.text, {
      urlEntities: this.props.tweet.entities.urls,
      usernameIncludeSymbol: true,
    });
  }

  render() {
    const user = this.props.tweet.user;

    return (
      <div className="TweetComponent">
        <div className="TweetComponent-header">
          <div className="TweetComponent-avatar">
            <img width={48} height={48} src={user.profile_image_url_https} />
          </div>
          <div className="TweetComponent-user">
            <h3 className="TweetComponent-name">
               {user.name.length ? user.name : user.screen_name}
            </h3>
            <h4 className="TweetComponent-username">
              {user.screen_name}
            </h4>
          </div>
        </div>

        <div className="TweetComponent-tweet"
          dangerouslySetInnerHTML={{__html: this._processTweet()}} />
      </div>
    );
  }
}
