/**
 * Color mappings for console log output.
 * @constant
 */
export const WinstonLoggerConsoleColors = {
  error: "red",
  warning: "yellow",
  info: "green",
  notice: "magenta",
  debug: "white",
  crit: "red",
  alert: "bold red",
  emerg: "bold red",
};

/**
 * Syslog-compatible log levels following RFC 5424.
 * @constant
 */
export const WinstonLoggerLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};
