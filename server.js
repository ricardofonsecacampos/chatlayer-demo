// HTTP server to link the application HTML page to services in NodeJS functions.

// Http server module.
const http = require('http')
// Serve static files.
const fs = require('fs')
// Parse request parameters.
const {parse} = require('querystring');
// Parse request parameters.
const db = require('./db.js');

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
	//console.log('placing order: ' + JSON.stringify(paramJSON))
	//console.log('placing order: ' + paramJSON.product + ', ' + paramJSON.quantity)
	let order = {product: paramJSON.product, quantity: paramJSON.quantity, value: ((100 * Math.random()) * paramJSON.quantity).toFixed(2)}
	db.saveOrder(order)
	callback(order)
}

const server = http.createServer((req, res) => {
	let location = 'frontend'
	let serveFile = true
	let contentType = 'text/html'
	
	switch (req.url) {
		case '/place-order':
		case '/list-order':
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
						let resJSON = {
							action: { nextDialogstate: param.nextDialog },
							session: {
								namespace: 'order',
								data: { "price": orderPlaced.value }
							}
						}
						res.end(JSON.stringify(resJSON))
					})
				})
				break;
			case '/list-order':
				db.listOrder((orders) => {
					res.end(JSON.stringify(orders))
				})
				break;
			default: 
					res.end()
		}
	}
}).listen(PORT)

console.log('Node server running on port ' + PORT)
