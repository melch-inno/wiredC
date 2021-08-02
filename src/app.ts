import express from "express";
import config from "config";
import log from "./logger";
import connect from "./db/connect";
import Route from "./routes";
import { deserializeUser } from "./middleware";

const port: number = config.get("port");
const host: string = config.get("host");

const app = express();
app.use(deserializeUser);

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, host, () => {
  log.info(`Server listening on http://${host}:${port}`);
  connect();
  Route(app);
});
