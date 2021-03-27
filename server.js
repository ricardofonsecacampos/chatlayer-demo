// HTTP server to link the application HTML page to services in NodeJS functions.

// Http server module.
const http = require('http')
// Serve static files.
const fs = require('fs')
// Parse request parameters.
const {parse} = require('querystring');

// use the port Heroku indicates
const PORT = process.env.PORT || 3000


function getPostJsonParams(request, callback) {
	if (request.method == 'POST') {
		let body = ''
		request.on('data', chunk => {body += chunk.toString()})
		request.on('end', () => callback(JSON.parse(body)))
	}
}

const server = http.createServer((req, res) => {
	let location = 'frontend'
	let serveFile = true
	let contentType = 'text/html'
	
	location += '/chatlayer-demo.html'
  
	// starts writing the response.
	res.writeHead(200, { 'content-type': contentType })
	
	// serve the requested file.
	if (serveFile) {
		fs.createReadStream(location).pipe(res)
	}
}).listen(PORT)

console.log('Node server running on port ' + PORT)
