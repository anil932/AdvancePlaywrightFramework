/**
 * Root-cause analysis for failed tests.
 *
 * Runs fully offline using a heuristic classifier over the error text, so the
 * reporter can always populate its AI Verdict tab without requiring a key or a
 * network round-trip.
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface RcaVerdict {
    severity: Severity;
    priority: string;
    rootCause: string;
    fixes: string[];
}

export interface FailureInput {
    title: string;
    file: string;
    error: string;
    stack?: string;
}

/**
 * Classifies a failure into a verdict. The rules are intentionally ordered from
 * most specific (infrastructure/network) to least specific (generic assertion).
 */
export async function analyzeFailure(input: FailureInput): Promise<RcaVerdict> {
    const text = `${input.error}\n${input.stack ?? ''}`.toLowerCase();

    if (/econnrefused|enotfound|etimedout|net::err|socket hang up|dns/.test(text)) {
        return {
            severity: 'critical',
            priority: 'P0',
            rootCause: 'The application or a dependent service was unreachable (network/connection error).',
            fixes: [
                'Confirm the target environment is up and the base URL is correct.',
                'Check network/VPN access from the test runner to the application host.',
                'Add a readiness check or retry before the failing navigation.',
            ],
        };
    }

    if (/strict mode violation|resolved to \d+ elements/.test(text)) {
        return {
            severity: 'high',
            priority: 'P1',
            rootCause: 'A locator matched more than one element (strict mode violation).',
            fixes: [
                'Narrow the locator so it resolves to a single element.',
                'Use .first()/.nth() only when every match is genuinely equivalent.',
                'Prefer a unique role/name or data-test attribute.',
            ],
        };
    }

    if (/timeout .*exceeded|waiting for|exceeded \d+ ?ms/.test(text)) {
        return {
            severity: 'high',
            priority: 'P1',
            rootCause: 'An action or assertion timed out waiting for the page/element to reach the expected state.',
            fixes: [
                'Verify the element selector still matches the current DOM.',
                'Wait for the app to settle (network idle / specific response) before acting.',
                'Raise the timeout only if the action legitimately takes longer.',
            ],
        };
    }

    if (/expected|tohave|tobe|toEqual|received/.test(text)) {
        return {
            severity: 'medium',
            priority: 'P2',
            rootCause: 'An assertion failed: the observed value did not match the expected value.',
            fixes: [
                'Confirm the expected value reflects the current application behaviour.',
                'Check for async data that had not finished loading when the assertion ran.',
                'Inspect recent app or test-data changes that could shift the value.',
            ],
        };
    }

    return {
        severity: 'medium',
        priority: 'P2',
        rootCause: 'The test failed. See the error and stack trace for the specific cause.',
        fixes: [
            'Read the full stack trace to locate the exact failing line.',
            'Re-run the test in headed mode to observe the failure.',
        ],
    };
}
