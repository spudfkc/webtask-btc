/* 
  cryptowat.ch API - https://cryptowat.ch/docs/api#prices
*/
'use strict';

const baseAttachmentUri = 'https://cryptowat.ch';
const baseUri = 'https://api.cryptowat.ch';
const iconUri = 'https://cdn.pixabay.com/photo/2017/03/12/02/57/bitcoin-2136339_960_720.png';
const request = require('superagent');
const _ = require('lodash');
const moment = require('moment');

function getPrice(pair, market, callback) {
  const uri = `${baseUri}/markets/${market}/${pair}/price`;
  request
    .get(uri)
    .set('accept', 'json')
    .end((err, res) => {
      callback(err, {
        price: _.get(res, 'body.result.price'),
        market,
        pair,
      });
    });
}

function formatMessage(price, market, pair) {
  return {
    response_type: 'in_channel',
    "attachments": [
      {
        "fallback": `1 BTC: $${price} (at ${market})`,
        "color": "#36a64f",
        "title": `1 BTC = $${price}`,
        "title_link": `${baseAttachmentUri}/${market}/${pair}`,
        "author_link": baseAttachmentUri,
        "author_icon": iconUri,
        "footer": `Price from ${market}`,
        "footer_icon": iconUri,
      }
    ]
  };
}

module.exports = (ctx, cb) => {
  getPrice('btcusd', 'gdax', function(err, data) {
    const price = data.price;
    const market = data.market;
    const pair = data.pair;
    
    if (err) {
      cb(null, {
        text: `An error occurred: ${err}`
      });
      return;
    }
    
    cb(null, formatMessage(price, market, pair));
  });
}
