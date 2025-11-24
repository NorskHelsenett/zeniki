import { HttpMethods } from "../../../common/common-types";

/**
 * FortiOS configuration revision response interface for change tracking and audit management.
 * 
 * Provides detailed metadata about FortiOS configuration changes, revision tracking, operational
 * context, enterprise-grade audit capabilities, Security Fabric integration, multi-VDOM support,
 * and comprehensive change management features for large-scale enterprise deployments.
 * 
 * @example
 * ```typescript
 * const enterpriseRevision: FortiOSRevisionResponse = {
 *   http_method: HttpMethods.POST,
 *   revision: '7.4.2024.1001',
 *   revision_changed: true,
 *   old_revision: '7.4.2024.1000',
 *   mkey: 'security-policy-dmz',
 *   status: 'success',
 *   http_status: 201,
 *   vdom: 'enterprise-prod',
 *   path: '/api/v2/cmdb/firewall/addrgrp',
 *   name: 'Enterprise_DMZ_Servers',
 *   action: 'create',
 *   serial: 'FGT60F3G12345678'
 * };
 * ```
 */
export interface FortiOSRevisionResponse {
  /**
   * HTTP method executed in the API request that generated this revision response.
   * @readonly
   * @see HttpMethods
   * @required
   */
  readonly http_method: HttpMethods;

  /**
   * Current system configuration revision identifier after the operation completion.
   * @readonly
   * @required
   */
  readonly revision: string;

  /**
   * Boolean flag indicating whether the configuration revision was modified by the operation.
   * @readonly
   * @required
   */
  readonly revision_changed: boolean;

  /**
   * Previous configuration revision identifier before the operation execution.
   * @readonly
   * @required
   */
  readonly old_revision: string;

  /**
   * Universal object identifier used across FortiOS configuration management.
   * @readonly
   * @required
   */
  readonly mkey: string;

  /**
   * Operation execution status indicating success or failure of the configuration change.
   * @readonly
   * @required
   */
  readonly status: string;

  /**
   * HTTP status code returned by the FortiOS API operation.
   * @readonly
   * @minimum 100
   * @maximum 599
   * @required
   */
  readonly http_status: number;

  /**
   * Virtual Domain (VDOM) name where the configuration operation was executed.
   * @readonly
   * @maxLength 31
   * @required
   */
  readonly vdom: string;

  /**
   * FortiOS API response path indicating the specific API endpoint that was accessed.
   * @readonly
   * @required
   */
  readonly path: string;

  /**
   * Configuration object name associated with the operation.
   * @readonly
   * @maxLength 79
   * @required
   */
  readonly name: string;

  /**
   * Specific action performed during the configuration operation.
   * @readonly
   * @values "create" | "edit" | "delete" | "move"
   * @required
   */
  readonly action: string;

  /**
   * Device serial number providing hardware identification context for the response.
   * @readonly
   * @required
   */
  readonly serial: string;

  /**
   * FortiOS build number providing system version context for the response.
   * @readonly
   * @minimum 1
   * @required
   */
  readonly build: number;
}
