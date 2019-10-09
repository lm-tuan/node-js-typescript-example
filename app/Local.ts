import { server } from "./lib/infrastructure/webserver/Server";
import * as dotenv from 'dotenv';
const appPort = 8080
server.listen(appPort, () => {
  console.log(`Service is running on ${appPort}`)
})