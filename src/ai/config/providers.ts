/**
 * LLM provider configuration for the reporter's AI agents.
 *
 * A key is optional: when none is set the reporter degrades gracefully
 * (no AI verdict / flaky summary) instead of failing the run.
 */

export type Provider = 'openai' | 'anthropic';

export interface ProviderConfig {
    provider: Provider;
    apiKey: string;
    model: string;
    baseUrl?: string;
}

/** Resolves the active provider from the environment, if any. */
export function getProviderConfig(): ProviderConfig | undefined {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
        return {
            provider: 'openai',
            apiKey: openaiKey,
            model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
            baseUrl: process.env.OPENAI_BASE_URL,
        };
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
        return {
            provider: 'anthropic',
            apiKey: anthropicKey,
            model: process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-latest',
            baseUrl: process.env.ANTHROPIC_BASE_URL,
        };
    }

    return undefined;
}

/** True when an LLM API key is configured. */
export function hasApiKey(): boolean {
    return getProviderConfig() !== undefined;
}
