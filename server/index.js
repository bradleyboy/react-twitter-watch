import { Server } from 'ws';
import http from 'http';
import express from 'express';
import compression from 'compression';
import Twitter from 'twitter';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.load();
}

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const app = express();
const port = process.env.PORT || 5000
const path = process.env.NODE_ENV === 'production' ? 'dist' : 'build';

app.use(compression());
app.use(express.static(process.cwd() + `/${path}`));

const server = http.createServer(app)
server.listen(port)

const wss = new Server({server: server})

wss.on('connection', (ws) => {
  let _stream = null;

  const openStream = (filter) => {
    if (_stream) {
      _stream.destroy();
    }

    client.stream('statuses/filter', {track: filter}, function(stream) {
      _stream = stream;

      stream.on('data', function(tweet) {
        ws.send(JSON.stringify({tweet, filter}));
      });

      stream.on('error', function(error) {
        openStream(filter);
      });
    });
  };

  ws.on('message', (filter) => {
    openStream(filter);
  });

  ws.on('close', () => {
    if (_stream) {
      _stream.destroy();
    }
  });
});
