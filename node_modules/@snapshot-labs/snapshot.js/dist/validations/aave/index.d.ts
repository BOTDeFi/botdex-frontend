export declare const author = "kartojal";
export declare const version = "0.1.0";
/**
 * Aave Space Validation proposal validation uses:
 *  - Proposition power of GovernanceStrategy contract
 *  - Other active Aave Snapshot voting strategies
 *
 * The current validation implementation mutates the "strategies" field of the space
 * to be able to use proposition power instead of voting power for "aave-governance-power".
 *
 */
export default function validate(author: string, space: any, proposal: any, options: any): Promise<boolean>;
