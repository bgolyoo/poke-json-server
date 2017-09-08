var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

function simpleAuth(req, res, next) {

  if (req.headers.authorization) {

    var user_and_password = new Buffer(req.headers.authorization.split(" ")[1], 'base64').toString();

    var user = user_and_password.split(':')[0];
    var password = user_and_password.split(':')[1];

    if (user === process.env.AUTH_USER && password === process.env.AUTH_PASSWORD) {
      next();
    } else {
      res.status(401).send({ error: 'unauthorized' })
    }

  } else {
    res.status(401).send({ error: 'unauthorized' })
  }
}

router.render = function (req, res) {
  res.json({
    body: res.locals.data
  })
}
server.use(middlewares)
server.use(simpleAuth);
server.use(router);
server.listen((process.env.PORT || 5000), function () {
  console.log('JSON Server is running on port ' + (process.env.PORT || 5000));
})
