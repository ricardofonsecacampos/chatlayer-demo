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

function placeOrder(paramJSON, callback) {
	console.log('placing order ' + paramJSON)
	let order = {value:1050}
	callback(order)
}

const server = http.createServer((req, res) => {
	let location = 'frontend'
	let serveFile = true
	let contentType = 'text/html'
	
	switch (req.url) {
		case '/place-order':
			serveFile = false
			break;
		case '/styles.css':
		case '/favicon.ico':
		case '':
		case '/':
			contentType = 'text/html'
			location += '/chatlayer-demo.html'
			break;
		default:
			break;
	}
  
	// starts writing the response.
	res.writeHead(200, { 'content-type': contentType })
	
	// serve the requested file.
	if (serveFile) {
		fs.createReadStream(location).pipe(res)
	
	} else {
		switch (req.url) {
			case '/place-order':
				getPostJsonParams(req, (param) => {
					placeOrder(param, (orderPlaced) => {
						  res.json({
							  action: { nextDialogstate },
							  session: {
								  namespace: 'order',
								  data: {
									  "order-price": orderPlaced.value
								  }
							  },
						  })
					})
				})
				break;
			default: 
					res.end()
		}
	}
}).listen(PORT)

console.log('Node server running on port ' + PORT)
