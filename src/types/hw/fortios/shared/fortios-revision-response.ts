import { HttpMethods } from "../../../common/common-types";

/**
 * FortiOS configuration revision response for change tracking and audit management.
 *
 * @example
 * ```typescript
 * const revision: FortiOSRevisionResponse = { http_method: HttpMethods.POST, revision: '7.4.2024.1001', revision_changed: true, old_revision: '7.4.2024.1000', mkey: 'policy-1', status: 'success', http_status: 201, vdom: 'root', path: '/api/v2/cmdb/firewall/addrgrp', name: 'DMZ_Servers', action: 'create', serial: 'FGT60F3G12345678', build: 1234 };
 * ```
 */
export interface FortiOSRevisionResponse {
  /** HTTP method executed in the API request
   * @readonly
   * @required
   */
  readonly http_method: HttpMethods;
  /** Current configuration revision identifier
   * @readonly
   * @required
   */
  readonly revision: string;
  /** Configuration revision was modified by operation
   * @readonly
   * @required
   */
  readonly revision_changed: boolean;
  /** Previous configuration revision identifier
   * @readonly
   * @required
   */
  readonly old_revision: string;
  /** Object identifier for configuration management
   * @readonly
   * @required
   */
  readonly mkey: string;
  /** Operation execution status
   * @readonly
   * @required
   */
  readonly status: string;
  /** HTTP status code from API operation
   * @readonly
   * @minimum 100
   * @maximum 599
   * @required
   */
  readonly http_status: number;
  /** Virtual Domain (VDOM) name for operation context
   * @readonly
   * @maxLength 31
   * @required
   */
  readonly vdom: string;
  /** API endpoint path accessed
   * @readonly
   * @required
   */
  readonly path: string;
  /** Configuration object name
   * @readonly
   * @maxLength 79
   * @required
   */
  readonly name: string;
  /** Action performed (create, edit, delete, move)
   * @readonly
   * @required
   */
  readonly action: string;
  /** Device serial number
   * @readonly
   * @required
   */
  readonly serial: string;
  /** FortiOS build number
   * @readonly
   * @minimum 1
   * @required
   */
  readonly build: number;
}
