const http = require('http');
const server = http.createServer( (request, response) => {
    console.log("request from " + request.url);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<html><body>Hello again, this time as ");
    response.write("<strong>HTML</strong></body></html>");
    response.end();
});
const port = 8080;

server.listen(port);
console.log("Server running at port=" + port);
console.log("dirname = " + __dirname);
console.log("filename = " + __filename);