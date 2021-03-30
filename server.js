const express = require('express');
const app = express();
const port = 3000;
const { getData, dbUpdateAll } = require('./core');
const { fsymsList, tsymsList } = require('./config');

setInterval(() => {dbUpdateAll()}, 120000); // 2 min

app.get('/service/price', (req, res) => {
    const fsyms = req.query.fsyms;
    const tsyms = req.query.tsyms;
    
    if (isCorrectQuery(fsyms, tsyms)) {
        getData(fsyms, tsyms)
        .then(
            data => { res.status(200).send(data); }
        )
        .catch( error => { res.status(500).send(error); });
    } else {
        res.status(500).send('Query sytax is wrong, or the currency par is not supported.');
    }
});

function isCorrectQuery(fsyms, tsyms) {
    return fsymsList.includes(fsyms) && tsymsList.includes(tsyms);
}


app.listen(port, () => {
    console.log('Server is listening at http://localhost:' + port);
});