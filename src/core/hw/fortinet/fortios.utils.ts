import differenceWith from "lodash.differencewith";
import {
  FortiOSFirewallAddrGrp,
  FortiOSFirewallAddrGrp6,
} from "../../../types";

/**
 * Calculates the differences between existing and new address group members.
 * @param existingGroup - Current address group configuration
 * @param newGroup - Desired address group configuration
 * @returns Promise resolving to object with added and removed member names
 * @throws {Error} When either group is undefined
 * @example
 * ```typescript
 * const changes = await getAddGrpMemberChanges(existing, desired);
 * // Result: { added: ['subnet-30'], removed: ['subnet-10'] }
 * ```
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
