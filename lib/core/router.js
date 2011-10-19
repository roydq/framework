/*
 * The router is used to determine which controller should handle a request.
 * It parses a configuration file that contains all of the routes, then routes request using the dispatch method.
 * The route config file is automatically loaded from a preset location when this module is required.
 * This can be considered the entry point for the actual application code.
 */
var router = function (config) {
	this.config = config;

	// Pre-regex-ify every route
	this.config.routes.forEach(function (route) {
		var regex = new RegExp(route.url, "i");
		route.url = regex;
	}, this);
};

router.prototype = {
	constructor : router,

	/*
	 * Dispatches an incoming request by sending it to the controller that will handle it.
	 */
	dispatch : function (req, res) {
		console.log('=== Begin ===');

		var route = findRoute(req.url);
		
		if (route === null) {
			console.log('No route found for ' + req.url);

			res.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			res.write('404 not found');

			return;
		}

		var body = "Hello world";

		res.writeHead(200, {
			'Content-Type': 'text/plain',
			'Content-Length' : body.length
		});

		res.write(body);
	},

	/*
	 * Finds the route for the given url
	 */
	findRoute : function (url) {
		var foundRoute = null;

		this.config.routes.forEach(function(route) {
			var match = route.url.exec(url);

			if (match !== null) {
				foundRoute = route;
				foundRoute.params = match;
				return false;
			}
		}, this);

		return foundRoute;
	}
};

// Export
exports.router = router;