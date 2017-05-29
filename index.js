const express = require('express');
const net = require('net');
const app = express();
const port = process.env.port || 31337;

const initHttp = () => {
    return new Promise((resolve, reject) => {
        app.listen(port, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
}


initHttp()
    .then(() => {
        console.log('app initialized on port ' + port)
    })
    .then(() => {
       return app.get('/alive', (req, res) => {
			let data = '';
			let socket = net.createConnection('/var/run/docker.sock', () => {
				var t = socket.write("GET /containers/json HTTP/1.0\n\n", 'utf8', () =>{socket.end()});
				socket.on('data', (chunk) => {
					console.log(chunk.toString());
					data += chunk;
				})
				socket.on('end', () => { return res.set({'Content-Type': 'application/json; charset=utf-8'}).status(200).send(data.toString()) })
			});
	   });
    })
    .catch((err) => {
        console.dir(err);
    });

