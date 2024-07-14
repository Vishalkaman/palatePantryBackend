const express = require('express');
const os = require('os');
const app = express();
const port = 3000;

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
        for (let alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const ip = getLocalIpAddress();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, ip, () => {
    console.log(`Server is running on http://${ip}:${port}`);
});

