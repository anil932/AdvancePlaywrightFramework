# Advance Playwright Framework

[![Playwright Tests](https://github.com/anil932/AdvancePlaywrightFramework/actions/workflows/playwright.yml/badge.svg)](https://github.com/anil932/AdvancePlaywrightFramework/actions/workflows/playwright.yml)

An advanced end-to-end test automation framework built with **Playwright** and **TypeScript**, using the **Page Object Model (POM)** and a custom HTML reporter. The sample suite exercises the TTA Cart demo application (`https://app.thetestingacademy.com/playwright/ttacart/`).

## Tech stack

- [Playwright Test](https://playwright.dev/) — test runner and browser automation
- TypeScript — type-safe test code
- Page Object Model — reusable page classes under `src/pages`
- Custom HTML reporter — see `src/utils/CustomReporter.ts`
- Allure Playwright — optional richer reporting
- Data readers — CSV, Excel, YAML, JSON and MySQL test data
- `@faker-js/faker` — random test data generation

## Project structure

```
AdvancePlaywrightFramework
├── src/
│   ├── ai/
│   │   ├── agents/          → RCA + flaky-test analysis
│   │   └── config/          → LLM provider configuration
│   ├── api/                 → API clients
│   ├── config/              → Environment configuration
│   ├── fixtures/            → Custom Playwright fixtures
│   ├── pages/               → Page Object Model
│   ├── testdata/            → Test data
│   ├── tests/               → Test cases
│   └── utils/               → Reusable utilities (reporter, data readers)
├── docs/
├── rules/
├── .github/                 → GitHub Actions CI
├── .env                     → Environment variables
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Getting started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm

### Install

```bash
npm install
npx playwright install --with-deps
```

### Environment

Configuration is read from `.env` (loaded in `playwright.config.ts` via `dotenv`). Copy the template and adjust as needed:

```bash
# Example .env
BASE_URL=https://app.thetestingacademy.com

# Optional: pick a target environment instead of a full BASE_URL
# TTA_ENV=qa   # qa | dev | local | stg | prod | api
```

The base URL is resolved by `resolveBaseURL()`: an explicit `BASE_URL` wins, otherwise `TTA_ENV` selects a preset (with `QA_BASE_URL`, `DEV_BASE_URL`, `STG_BASE_URL`, `PROD_BASE_URL`, `API_BASE_URL` overrides).

## Running tests

```bash
npx playwright test                 # all projects
npx playwright test --project=chromium
npx playwright test src/tests/login.spec.ts
npx playwright test --headed
npx playwright test --ui
```

## Reports

The custom reporter writes a self-contained HTML report to `tta-report/`:

- `tta-report/report_<timestamp>.html` — a report per run
- `tta-report/index.html` — redirects to the latest report
- `tta-report/history.html` — links to all previous runs

Open the latest report with:

```bash
open tta-report/index.html
```

The report includes per-test steps, console logs, screenshots, video and traces, plus optional AI tabs (AI Data, AI Verdict, Flaky, Self-Heal). Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to enable the AI verdict/flaky summaries; without a key the reporter degrades gracefully.

## Utilities (`src/utils`)

| File | Purpose |
| --- | --- |
| `CustomReporter.ts` | Custom TTA HTML reporter |
| `stepScreenshot.ts` | Attach a screenshot to a specific `test.step` |
| `csvReader.ts` | Read CSV test data |
| `excelReader.ts` | Read Excel test data |
| `yamlReader.ts` | Read YAML test data |
| `dbReader.ts` | Read test data from MySQL |
| `selfHeal.ts` | Types for the self-heal locator report |

## Continuous integration

`.github/workflows/playwright.yml` runs the suite on Chromium, Firefox and WebKit for every push and pull request to `main`/`master`, uploading the HTML report as a build artifact.

## Author

The Testing Academy — <https://thetestingacademy.com>
