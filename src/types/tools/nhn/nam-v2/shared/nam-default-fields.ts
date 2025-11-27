/**
 * NAM v2 default MongoDB fields.
 * Standard database fields for document metadata,
 * user operations, sessions, and change management.
 * 
 * @example
 * ```typescript
 * const document: NAMDefaultFields = {
 *   createdBy: "user123",
 *   createdAt: new Date(),
 *   roll_back: false
 * };
 * ```
 */
import mongodb, { ObjectId } from "mongodb"

export interface NAMDefaultFields {
  /**
   * MongoDB document ID.
   * @readonly
   */
  readonly _id?: string | ObjectId;
  
  /**
   * MongoDB version key.
   * @readonly
   */
  readonly __v?: number;
  
  /** User who created document. */
  createdBy?: string;
  
  /** User who last updated document. */
  updatedBy?: string;
  
  /**
   * Creation timestamp.
   * @readonly
   */
  createdAt?: Date;
  
  /** Update timestamp. */
  updatedAt?: Date;
  
  /** Session identifier. */
  session_id?: string;
  
  /** Parent document reference. */
  parent?: any;
  
  /**
   * Rollback flag.
   * @default false
   */
  roll_back?: boolean;
}