const { getUsers } = require('../services/googleSheetService');

let users = [];

getUsers().then(data => {
    users = data;
}).catch(err => console.log('Error landing users:', err));

module.exports = { users };