import Transport, { TransportStreamOptions } from "winston-transport";
import { TransformableInfo } from "logform";
import { RequestConfig } from "../base/zeniki-core-driver";

/**
 * Winston transport for Splunk HTTP Event Collector (HEC) integration.
 * Sends structured log events to Splunk HEC endpoint via HTTP POST using native fetch API.
 *
 * @extends Transport
 * @example
 * ```typescript
 * const hecTransport = new WinstonHecLogger({
 *   baseURL: 'https://splunk.example.com:8088',
 *   headers: { Authorization: 'Splunk <token>' }
 * }, { level: 'info' });
 * ```
 */
export class WinstonHecLogger extends Transport {
  /** Request configuration for HEC API communication */
  protected config: RequestConfig;

  /**
   * Initializes Winston HEC Logger transport with request configuration.
   * @param config - Request configuration for HEC endpoint
   * @param opts - Winston transport stream options
   * @example
   * ```typescript
   * new WinstonHecLogger({
   *   baseURL: 'https://splunk.example.com:8088',
   *   headers: { Authorization: 'Splunk token' }
   * });
   * ```
   */
  constructor(config: RequestConfig, opts?: TransportStreamOptions) {
    super(opts);

    this.config = config;
  }

  /**
   * Sends formatted log events to Splunk HEC.
   * @override
   * @param info - Winston log information object
   * @param next - Callback function to signal completion
   * @example
   * ```typescript
   * transport.log({ level: 'info', message: 'test' }, () => {});
   * ```
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
   * @example
   * ```typescript
   * hecTransport.dispose();
   * ```
   */
  public dispose(): void {
    // Clear references for garbage collection
    (this.config as any) = null;

    // Remove all event listeners
    this.removeAllListeners();
  }
}
