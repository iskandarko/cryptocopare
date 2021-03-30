const values = ['CHANGE24HOUR', 'CHANGEPCT24HOUR', 'OPEN24HOUR', 'VOLUME24HOUR', 'VOLUME24HOURTO', 'LOW24HOUR', 'HIGH24HOUR', 'PRICE', 'SUPPLY', 'MKTCAP'];
const fsymsList = ["BTC", "XRP", "ETH", "BCH", "EOS", "LTC", "XMR", "DASH"];
const tsymsList = ["USD", "EUR", "GBP", "JPY", "RUR"];
const mySqlSettings = { host: 'localhost', user: 'root', password: '', database: 'cryptocompare'};

module.exports = { values, fsymsList, tsymsList, mySqlSettings };