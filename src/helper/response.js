import moment from "moment-timezone";
import CONSTANT from "./constant.js";

const RESPONSE = (requestTime, message, data, error) => {
  return {
    requestTime,
    message,
    data,
    error,
    responseTime: moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT),
  };
};

export default RESPONSE;
