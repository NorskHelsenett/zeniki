/**
 * @fileoverview FortiOS utility functions for address group member management.
 * 
 * Provides helper functions for comparing and calculating differences between FortiOS
 * firewall address group configurations. Used to determine which members need to be
 * added or removed when updating address groups in FortiGate firewalls.
 */

import differenceWith from "lodash.differencewith";
import {
  FortiOSFirewallAddrGrp,
  FortiOSFirewallAddrGrp6,
} from "../../../types";

/**
 * Calculates the differences between existing and new address group members.
 * Compares two FortiOS address group configurations and returns the members that need
 * to be added or removed to transform the existing group into the new group state.
 * 
 * @param existingGroup - Current address group configuration from FortiGate
 * @param newGroup - Desired address group configuration to apply
 * @returns Promise resolving to object with added and removed member names
 * 
 * @example
 * ```typescript
 * import { getAddGrpMemberChanges } from '@norskhelsenett/zeniki/core';
 * 
 * const existing = {
 *   name: 'internal-networks',
 *   member: [
 *     { name: 'subnet-10' },
 *     { name: 'subnet-20' }
 *   ]
 * };
 * 
 * const desired = {
 *   name: 'internal-networks',
 *   member: [
 *     { name: 'subnet-20' },
 *     { name: 'subnet-30' }
 *   ]
 * };
 * 
 * const changes = await getAddGrpMemberChanges(existing, desired);
 * // Result: { added: ['subnet-30'], removed: ['subnet-10'] }
 * ```
 * 
 * @throws {Error} When either existingGroup or newGroup is undefined
 * @since 1.0.0
 */
export const getAddGrpMemberChanges = async (
  existingGroup: FortiOSFirewallAddrGrp | FortiOSFirewallAddrGrp6,
  newGroup: FortiOSFirewallAddrGrp | FortiOSFirewallAddrGrp6
) => {
  if (!existingGroup || !newGroup) {
    throw new Error("FortiOS member group(s) cannot be undefined");
  }

  const compareMembers = (array1Value: any, array2Value: any) => {
    return array1Value.name === array2Value.name;
  };

  // Find members in existingGroup not in newGroup
  const removed = differenceWith(
    existingGroup.member,
    newGroup.member,
    compareMembers
  );

  // Find members in newGroup not in existingGroup
  const added = differenceWith(
    newGroup.member,
    existingGroup.member,
    compareMembers
  );

  return {
    added: added.map((member: { name: string; }) => {
      return member.name;
    }),
    removed: removed.map((member: { name: string; }) => {
      return member.name;
    }),
  };
};
