# yet-another-js-course-tf

Playwright end-to-end test suite written against the public demo shop
[practicesoftwaretesting.com](https://practicesoftwaretesting.com), built as coursework.

## Requirements

- Node.js 18+
- npm

## Setup

Install dependencies:

```bash
npm install
```

Install the browsers Playwright drives (Chromium, Firefox, WebKit):

```bash
npx playwright install
```

## Running the tests

Run the whole suite across all three browsers:

```bash
npm test
```

Useful variations:

```bash
npx playwright test --project=chromium
```

```bash
npx playwright test tests/login.spec.ts
```

```bash
npx playwright test --headed
```

```bash
npx playwright test --ui
```

## Viewing results

The HTML reporter writes to `playwright-report/`. Open the last run with:

```bash
npx playwright show-report
```

Traces are recorded on the first retry, so a failing test on CI leaves a trace you can
open from the report.

## Layout

```
playwright.config.ts   Shared config: baseURL, browser projects, reporter
tests/                 Test specs
  login.spec.ts        Logs in as the demo customer and checks the account page
```

## Configuration notes

- `baseURL` is `https://practicesoftwaretesting.com`, so specs navigate with relative
  paths such as `page.goto('/auth/login')`.
- `testIdAttribute` is set to `data-test`, matching the attributes the demo site ships.
  That means `page.getByTestId('email')` resolves `[data-test="email"]`.
- Tests run fully in parallel locally. On CI (`process.env.CI`) they drop to a single
  worker, retry twice, and `test.only` fails the build.

The suite signs in with the demo store's published customer account
(`customer@practicesoftwaretesting.com`), which is public sample data — no real
credentials live in this repo.
