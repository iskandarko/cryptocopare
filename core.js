const https = require('https');
const mysql = require('mysql');
const { values, fsymsList, tsymsList, mySqlSettings } = require('./config');

const pool = mysql.createPool(mySqlSettings);

function getData(fsyms, tsyms) {
    return new Promise((resolve, reject) => {
        makeAPIRequest(fsyms, tsyms)
        .then(
            data => { resolve(data) }, 
            apiError => {
                console.log('Request to external API has failed: ' + apiError);
                console.log('Getting data from DB instead...');
                dbGetData(fsyms, tsyms)
                .then(
                    data => { resolve(data) },
                    dbError => {
                        console.log('DB request failed: ' + new Date());
                        const error = {apiError : apiError, dbError : dbError};
                        reject(error);
                    }
                );
            });
    });
}

function makeAPIRequest(fsyms, tsyms) {
    return new Promise((resolve, reject) => {
       const req = https.request(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`, (res) => {
         if (res.statusCode < 200 || res.statusCode >= 300) {
               return reject(new Error('statusCode=' + res.statusCode));
           }
           res.setEncoding('utf8');
           let rawData = ''; 
           let parsedData = {};
           let filteredData = {};
           res.on('data', chunk => { rawData += chunk; });
           res.on('end', () => {
               try {
                    parsedData = JSON.parse(rawData);
                    filteredData = filterData(fsyms, tsyms, parsedData);
               } catch(e) {
                   reject(e);
               }
               resolve(JSON.stringify(filteredData));
           });
       });
       req.on('error', (e) => {
         reject(e.message);
       });
      req.end();
   });
}

function filterData(fsyms, tsyms, data) {
    const filteredData = values.reduce((accumulator, value) => {
        accumulator['RAW'][fsyms][tsyms][value] = data['RAW'][fsyms][tsyms][value];
        accumulator['DISPLAY'][fsyms][tsyms][value] = data['DISPLAY'][fsyms][tsyms][value];
        return accumulator;
    }, { RAW: { [fsyms] : { [tsyms] : {} } }, DISPLAY: { [fsyms] : { [tsyms] : {} } } });

    return filteredData;
}

function dbGetData(fsyms, tsyms) {
    return new Promise((resolve, reject) => {
        const pair = fsyms + '-' + tsyms;
        const sql = `SELECT data from ComparedCurrencies where currencyPair = "${pair}"`;
            pool.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].data);
                }
            });
    });
}

function dbSetData(fsyms, tsyms, data) {
    return new Promise((resolve, reject) => {
        const pair = fsyms + '-' + tsyms;
        const values = {
            currencyPair: pair,
            data: data
        }
        const sql = `UPDATE ComparedCurrencies SET ? WHERE currencyPair = "${pair}"`;
        pool.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }); 
}

function dbUpdateAll() {
    console.log('DB update started: ' + new Date());

    let dbUpdatePromises = createDbUpdatePromises();

    Promise.all(dbUpdatePromises)
    .then(() => console.log('DB update finished: ' + new Date()))
    .catch((error) => {
        console.log('DB update failed: ' + error);
    });
}

function createDbUpdatePromises() {
    let promises = [];

    fsymsList.forEach((fsyms) => {
        tsymsList.forEach((tsyms, tsymsIndex) => {
            promises.push(
                new Promise((resolve, reject) => {
                        setTimeout(() => { // To awoid banning from cryptocompare.com API
                            makeAPIRequest(fsyms, tsyms)
                            .then(
                                data => {
                                    dbSetData(fsyms, tsyms, data)
                                    .then(() => resolve())
                                    .catch(dbError => reject(dbError));
                                },
                                apiError => reject(apiError));
                        }, tsymsIndex * 500);
                })
            );
        });
    });

    return promises;
}

module.exports = { getData, dbUpdateAll};