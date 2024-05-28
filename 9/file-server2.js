const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const output500Error = (response) => {
    response.writeHead(500, { "Content-Type": "text/html" });
    response.write("<h1>500 Error</h1>\n");
    response.write("Something went wrong with request\n");
    response.end();
};
const mimeTypes = [
    ['.html', 'text/html'],
    ['.json', 'application/json'],
    ['.jpg', 'image/jpeg'],
    ['.svg', 'image/svg+xml']
];

const server = http.createServer((req, resp) => {
    let urlFile = url.parse(req.url).pathname;

    if (urlFile.length == 1) urlFile = "/index.html";
    console.log("Filename in URL=" + urlFile);

    const localPath = __dirname + "/";
    let localFile = path.join(localPath, urlFile);

    console.log("Filename on device=" + localFile);
    fs.readFile(localFile, (err, file) => {
        if (err) {
            output500Error(resp);
        
            return;
        }

        const ext = path.parse(localFile).ext;
        const mime = mimeTypes.find(m => m[0] == ext);
        const header = {
            "Content-type": mime[1] || "text/plain"
        };
        
        resp.writeHead(200, header);
        resp.write(file);
        resp.end();
    });
});
let port = 8080;

server.listen(port);
console.log("Server running at port= " + port);