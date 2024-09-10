import http from "http";

function requestController() {
  console.log("Holis");
}

const server = http.createServer(requestController);

server.listen(8080);
