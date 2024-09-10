import http from "http";
import "dotenv/config";

function requestController() {
  console.log("Holis");
}

const server = http.createServer(requestController);

const PORT = process.env.PORT || 8080;

server.listen(PORT);
