/**
 * MongoDB default fields and additional NAMv2 fields interface.
 * Provides standard database fields for tracking document metadata,
 * user operations, sessions, and change management operations.
 * 
 * @interface NAMDefaultFields
 * @since NAMv2
 * @context MongoDB document operations
 * 
 * @example
 * ```typescript
 * const document: NAMDefaultFields = {
 *   _id: "507f1f77bcf86cd799439011",
 *   createdBy: "user123",
 *   updatedBy: "user456",
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 *   session_id: "sess_abc123",
 *   parent: null,
 *   roll_back: false
 * };
 * ```
 */

import mongodb, { ObjectId } from "mongodb"

export interface NAMDefaultFields {
  /**
   * MongoDB document identifier
   * @optional
   * @readonly
   */
  readonly _id?: string | ObjectId;
  
  /**
   * MongoDB version key for optimistic concurrency control
   * @optional
   * @readonly
   */
  readonly __v?: number;
  
  /**
   * User identifier who created the document
   * @optional
   */
  createdBy?: string;
  
  /**
   * User identifier who last updated the document
   * @optional
   */
  updatedBy?: string;
  
  /**
   * Timestamp when document was created
   * @optional
   * @readonly
   */
  createdAt?: Date;
  
  /**
   * Timestamp when document was last updated
   * @optional
   */
  updatedAt?: Date;
  
  /**
   * Session identifier for tracking session-based changes
   * @optional
   */
  session_id?: string;
  
  /**
   * Reference to parent document for legacy tracking
   * @optional
   */
  parent?: any;
  
  /**
   * Flag indicating if operation is for change rollback
   * @optional
   * @default false
   */
  roll_back?: boolean;
}