This code implements the task described below.
Developed by Iskandar Mamadnazarov.
Please note that DB dump is available in the source folder.

============================================================

Create a microservice that collect data from a cryptocompare using its API
for example (https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD,EUR) For instance:
"fsyms" => ["BTC", "XRP", "ETH", "BCH", "EOS", "LTC", "XMR", "DASH"], "tsyms" => ["USD", "EUR", "GBP", "JPY", "RUR"],
Struct of response currency
{
CHANGE24HOUR string CHANGEPCT24HOUR string OPEN24HOUR string VOLUME24HOUR string VOLUME24HOURTO string
LOW24HOUR HIGH24HOUR
string string
PRICE SUPPLY MKTCAP
string
string
string
}
Currency pairs should be configurable.
Mysql parameters should be configurable.
Service must store data to mysql by sheduler (rawjson is ok).
Service must work in background.
If cryptocompare is non accessible service must return data from database via own API. Data in response must be fresh (realtime). 2-3 minutes discrepancy is ok.
Using websockets is a plus. Clean architecture is a plus. Service scalability is a plus. APPENDIX:
Example of HTTP request:
GET service/price?fsyms=BTC&tsyms=USD Example of response:
{
"RAW": {
"BTC": { "USD": {
"CHANGE24HOUR": -13.25, "CHANGEPCT24HOUR": -0.18152873223073468, "OPEN24HOUR": 7299.12,
"VOLUME24HOUR": 47600.120073200706, "VOLUME24HOURTO": 348033250.4911315, "LOW24HOUR": 7197.22,
"HIGH24HOUR": 7426.64,
"PRICE": 7285.87,
"LASTUPDATE": 1586433196,
"SUPPLY": 18313937,
"MKTCAP": 133432964170.19
}
} },
"DISPLAY": { "BTC": {
"USD": {
"CHANGE24HOUR": "$ -13.25", "CHANGEPCT24HOUR": "-0.18", "OPEN24HOUR": "$ 7,299.12", "VOLUME24HOUR": "Ƀ 47,600.1", "VOLUME24HOURTO": "$ 348,033,250.5", "HIGH24HOUR": "$ 7,426.64",
"PRICE": "$ 7,285.87",
"FROMSYMBOL": "Ƀ",
"TOSYMBOL": "$",
"LASTUPDATE": "Just now",
"SUPPLY": "Ƀ 18,313,937.0",
"MKTCAP": "$ 133.43 B"
}
} }
}
Example of WS request:
WS service/price
{ "fsyms": "DASH", "tsyms": "RUR" }

============================================================