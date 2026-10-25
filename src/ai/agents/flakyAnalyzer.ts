/**
 * Flaky-test analysis: compares this build's per-test statuses against the
 * previous build's snapshot and reports which tests changed outcome.
 *
 * The comparison itself is deterministic and offline. `llmEnabled` is accepted
 * for API symmetry with the reporter; no network call is made here.
 */

/** A single build's snapshot: run id plus status per full test title. */
export interface BuildSummary {
    runId: string;
    tests: Record<string, string>;
}

export interface FlakyCounts {
    flaky: number;
    failing: number;
    total: number;
}

export interface FlakyResult {
    counts: FlakyCounts;
    flaky: string[];
    summary?: string;
}

/** A test is flaky when its pass/fail status flipped between the two builds. */
export async function analyzeFlaky(
    prev: BuildSummary,
    curr: BuildSummary,
    _llmEnabled: boolean,
): Promise<FlakyResult> {
    const total = Object.keys(curr.tests).length;
    const failing = Object.values(curr.tests).filter(
        (status) => status === 'failed' || status === 'timedOut',
    ).length;

    const flaky: string[] = [];
    for (const [title, status] of Object.entries(curr.tests)) {
        const before = prev.tests[title];
        if (before === undefined) continue;

        const wasPass = before === 'passed' || before === 'skipped';
        const nowPass = status === 'passed' || status === 'skipped';
        if (wasPass !== nowPass) {
            flaky.push(title);
        }
    }

    flaky.sort();
    return { counts: { flaky: flaky.length, failing, total }, flaky };
}
