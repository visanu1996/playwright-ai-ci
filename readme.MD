# Playwright AI CI

An extensible Playwright test automation framework designed to let AI-assisted development work within a predictable, pre-defined project structure.

The framework is intended to support both web and API automation while keeping browser, context, page, session, configuration, and secret management in clearly separated locations. New applications can be added incrementally without changing the foundation of the project.

## Goals

- Provide a consistent structure for AI-assisted test development.
- Keep browser and context lifecycle management in one place.
- Build reusable Page Object Model (POM) components.
- Support composition of page objects through a shared `BasePage`.
- Manage API sessions independently through Playwright's request API.
- Keep configuration and secrets separate from test and page logic.
- Run the same tests locally and in GitHub Actions CI.
- Scale without making fixture definitions the central dependency of the framework.

## Project Structure

```text
.
├── config/
│   ├── config.ts             # Environment and framework configuration
│   └── secret.ts             # Local or environment-specific secrets
├── src/
│   ├── core/
│   │   ├── DriverFactory.ts  # Browser, context, page, and pages lifecycle
│   │   ├── BasePage.ts        # Shared web page behavior and composition
│   │   └── API.ts             # Independent API session and response handling
│   └── pages/
│       ├── playwright/        # Playwright web application page objects
│       └── sauce-demo/        # Sauce Demo web application page objects
├── tests/                     # Playwright test specifications
├── playwright.config.ts       # Playwright test runner configuration
└── .github/workflows/
	└── playwright.yml         # GitHub Actions workflow
```

Some framework files and application folders are planned extension points and will be added as the framework grows.

## Architecture

### DriverFactory

`DriverFactory` will own the browser and context lifecycle. It will also expose the active `page` and a collection of pages for composition by the web layer.

Keeping `page` and `pages` in the driver layer is intentional. When a child page object extends `BasePage`, the shared objects should be supplied by the framework rather than recreated or overwritten by the child class. This keeps browser state consistent across composed page objects.

### BasePage and Page Objects

`BasePage` will contain common web behavior such as navigation helpers, shared locators, waits, and reusable actions. Application-specific page objects will extend `BasePage` and live under `src/pages/`.

Examples of future page object groups include:

- Playwright web application pages.
- Sauce Demo web application pages.
- Additional applications as the test suite expands.

Page objects should describe application behavior, while browser and context creation remains the responsibility of `DriverFactory`.

### API

`API.ts` will manage API sessions independently of the browser UI layer using Playwright's request APIs:

- `APIRequestContext` for session and request lifecycle management.
- `APIResponse` for response status, headers, and body handling.
- Playwright's `request` module for creating and managing request contexts.

The API layer will create, use, and dispose of its own request context so API tests do not need to depend on browser fixtures or UI state.

### Why Avoid Fixture-First Design?

Playwright fixtures are useful for small and medium-sized suites, but making them the primary extension mechanism can become difficult to scale when many applications, page groups, API clients, and session types are introduced.

This project therefore favors explicit framework-owned classes and composition. The goal is to make dependencies visible, keep lifecycle decisions in dedicated classes, and allow the framework to grow without a large fixture hierarchy that is difficult to maintain.

## Configuration and Secrets

The `config/` folder is reserved for shared configuration and environment-specific values:

- `config.ts` will contain URLs, environment names, timeouts, and other non-secret settings.
- `secret.ts` will contain credentials, tokens, and other sensitive values.

Secrets must not be committed to source control. Prefer environment variables or a local, ignored secrets file for development, and GitHub Actions Secrets for CI.

## Getting Started

### Prerequisites

- Node.js LTS.
- npm.

### Install dependencies

```bash
npm install
npx playwright install
```

### Run the tests

```bash
npx playwright test
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run a specific browser project:

```bash
npx playwright test --project=chromium
```

Open the HTML report after a test run:

```bash
npx playwright show-report
```

## Browser Projects

The current Playwright configuration includes:

- Chromium.
- ~~Firefox.~~
- ~~WebKit.~~

Additional mobile or branded browser projects can be enabled in `playwright.config.ts` when they are needed.

## Continuous Integration

GitHub Actions runs the test suite on pushes and pull requests targeting `main` or `master`.

The workflow:

1. Checks out the repository.
2. Installs the Node.js LTS runtime.
3. Installs dependencies with `npm ci`.
4. Installs Playwright browsers and system dependencies.
5. Runs the Playwright test suite.
6. Uploads the HTML report as a workflow artifact for 30 days.

The CI workflow is defined in `.github/workflows/playwright.yml`.

## Roadmap

- Implement `DriverFactory`.
- Add `BasePage` and shared web utilities.
- Add the independent `API` session manager.
- Add Playwright and Sauce Demo page objects.
- Move environment values into `config/config.ts`.
- Add secure secret loading through environment variables or CI secrets.
- Add API and UI example tests using the framework classes.
- Expand GitHub Actions with environment-specific execution and reporting.

## License

This project is currently private or experimental. Add the project license here when one is selected.
