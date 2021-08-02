/* eslint-disable github/no-then */
import mongoose from "mongoose";
import config from "config";
import log from "../logger";

async function connect(): Promise<void> {
  const dbUri: string = config.get("dbUri");
  return mongoose
    .connect(dbUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      log.info("Database connected - (MongoDB)");
    })
    .catch((error) => {
      log.error("db error", error);
      process.exit(1);
    });
}

export default connect;
