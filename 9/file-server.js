const http = require("http");
const fs = require("fs");
const server = http.createServer( (req, resp) => {
    const filename = "sample.html";

    try {
        const file = fs.readFileSync(filename);
        
        resp.writeHead(200, {"Content-Type": "text/html"});
        resp.write(file);
        resp.end();
    } catch {
        resp.writeHead(500, {"Content-Type": "text/html"});
        resp.write("<h1>500 Error - File not found</h1>\n");
        resp.end();
    }
});

let port = 8080;

server.listen(port);
console.log("Server running at port= " + port);