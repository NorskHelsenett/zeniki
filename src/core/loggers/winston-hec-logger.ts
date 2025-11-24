import Transport, { TransportStreamOptions } from "winston-transport";
import { TransformableInfo } from "logform";
import { RequestConfig } from "../base/zeniki-core-driver";

/**
 * Winston transport for Splunk HTTP Event Collector (HEC) integration.
 * Extends Winston Transport to send structured log events to Splunk HEC endpoint via HTTP POST.
 * Uses native fetch API for HTTP communication with token-based authentication and error handling.
 *
 * @class WinstonHecLogger
 * @extends Transport
 * @since 1.0.0
 * @context Splunk HEC log streaming with Winston integration
 *
 * @example
 * const hecTransport = new WinstonHecLogger({
 *   baseURL: 'https://splunk.example.com:8088',
 *   headers: { Authorization: 'Splunk <token>' }
 * }, {
 *   level: 'info',
 *   format: winston.format.json()
 * });
 */
export class WinstonHecLogger extends Transport {
  /**
   * Request configuration for HEC API communication
   * @protected
   * @type {RequestConfig}
   */
  protected config: RequestConfig;

  /**
   * Initializes Winston HEC Logger transport with request configuration.
   * Sets up native fetch configuration for HEC endpoint connection.
   *
   * @param {RequestConfig} config - Request configuration for HEC endpoint connection
   * @param {TransportStreamOptions} [opts] - Winston transport stream options
   * @required config
   * @optional opts
   *
   * @example
   * const transport = new WinstonHecLogger({
   *   baseURL: 'https://splunk.example.com:8088',
   *   headers: { Authorization: 'Splunk abc123' }
   * });
   */
  constructor(config: RequestConfig, opts?: TransportStreamOptions) {
    super(opts);

    this.config = config;
  }

  /**
   * Winston transport log method that sends formatted log events to Splunk HEC.
   * Extracts event data from log info and posts to HEC collector endpoint.
   * Only sends logs containing valid event structure in message symbol.
   *
   * @public
   * @override
   * @param {TransformableInfo} info - Winston log information object with formatted message
   * @param {Function} next - Callback function to signal completion
   * @required info
   * @required next
   *
   * @example
   * transport.log({ level: 'info', message: 'test' }, () => {});
   */
  public override log(info: TransformableInfo, next: () => void) {
    const data = JSON.parse(info[Symbol.for("message")] as string);

    if (data && data["event"]) {
      fetch(this.config.baseURL + "/services/collector/event", {
        method: "POST",
        body: JSON.stringify(data),
        ...this.config,
      })
        .then((res) => {
          next();
        })
        .catch((error) => {
          this.emit("error", error);
        });
    } else {
      next();
    }
  }

  /**
   * Disposes of the logger instance and cleans up resources.
   * Clears references to prevent memory leaks.
   * Should be called when removing the transport from Winston logger.
   *
   * @public
   *
   * @example
   * ```typescript
   * const hecTransport = new WinstonHecLogger(config);
   * logger.add(hecTransport);
   * // ... use logger
   * logger.remove(hecTransport);
   * hecTransport.dispose(); // Clean up resources
   * ```
   */
  public dispose(): void {
    // Clear references for garbage collection
    (this.config as any) = null;

    // Remove all event listeners
    this.removeAllListeners();
  }
}
