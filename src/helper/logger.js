import moment from "moment-timezone";
import CONSTANT from "./constant.js";

const customLog = (type, text) => {
  console.log(
    `[${moment()
      .tz(CONSTANT.WIB)
      .format(CONSTANT.DATE_FORMAT)}] ${type} ${text}`
  );
};

const LOGGER = {
  Info: (text) => {
    customLog("INFO", text);
  },
  Debug: (text) => {
    customLog("DEBUG", text);
  },
  Error: (text) => {
    customLog("ERROR", text);
  },
};

export default LOGGER;
