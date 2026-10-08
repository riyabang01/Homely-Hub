const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, './config.env') });
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = require('./app');

const port = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`HomelyHub is running locally on port: ${port}`);
    });
} else {
    app.listen(port);
}

module.exports = app;
