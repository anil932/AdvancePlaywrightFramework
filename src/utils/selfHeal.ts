/**
 * Shape of the `self-heal` attachment consumed by CustomReporter (Self-Heal tab).
 * A self-heal run proposes replacement locators for a dead selector; the report
 * renders the verified candidates and the rejected ones.
 */

export interface HealCandidate {
    selector: string;
    strategy: string;
    matchCount: number;
    visible: boolean;
    reasoning: string;
}

export interface RejectedCandidate {
    selector: string;
    reason: string;
}

export interface HealReport {
    /** The locator that failed in the test. */
    failedSelector: string;
    /** What the broken locator was trying to find. */
    intent: string;
    /** Candidates that resolved to exactly one element. */
    verified: HealCandidate[];
    /** Candidates that were tried and discarded. */
    rejected: RejectedCandidate[];
    /** Set when the healing agent itself could not run. */
    unavailableReason?: string;
}
