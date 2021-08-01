//configure logger for the application
import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  prettyPrint: true,
  base: {
    pid: "true",
  },
  timestamp: () => `, "time": "${dayjs().format()}"`,
});

export default log;
