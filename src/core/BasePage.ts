import { Locator, Page } from '@playwright/test';

import { DriverFactory } from './DriverFactory';

export type PageLocator = Locator | string;
export type SelectOption = Parameters<Locator['selectOption']>[0];

export interface FillLocatorOptions {
  isSecret?: boolean;
  timeout?: number;
}

export interface ClickElementOptions {
  timeout?: number;
  force?: boolean;
  clickCount?: number;
  button?: 'left' | 'right' | 'middle';
}

export interface RetryOptions {
  attempts?: number;
  delay?: number;
}

export abstract class BasePage {
  public readonly wd: DriverFactory;

  protected constructor(driverFactory: DriverFactory) {
    this.wd = driverFactory;
  }

  public get page(): Page {
    if (!this.wd.page) {
      throw new Error('DriverFactory must be started before using a page object.');
    }

    return this.wd.page;
  }

  public get pages(): Readonly<Record<string, Page>> {
    return this.wd.pages;
  }

  protected getLocator(locator: PageLocator): Locator {
    return typeof locator === 'string' ? this.page.locator(locator) : locator;
  }

  protected async fillLocator(
    locator: PageLocator,
    value: string,
    options: FillLocatorOptions = {},
  ): Promise<void> {
    const { timeout } = options;
    await this.getLocator(locator).fill(value, { timeout });
  }

  protected async clickElement(
    locator: PageLocator,
    options: ClickElementOptions = {},
  ): Promise<void> {
    await this.getLocator(locator).click(options);
  }

  protected async clearLocator(locator: PageLocator, timeout?: number): Promise<void> {
    await this.getLocator(locator).fill('', { timeout });
  }

  protected async getLocatorText(locator: PageLocator, timeout?: number): Promise<string> {
    return this.getLocator(locator).innerText({ timeout });
  }

  protected async isLocatorVisible(locator: PageLocator, timeout?: number): Promise<boolean> {
    return this.getLocator(locator).isVisible({ timeout });
  }

  protected async waitForLocator(
    locator: PageLocator,
    state: 'attached' | 'detached' | 'hidden' | 'visible' = 'visible',
    timeout?: number,
  ): Promise<void> {
    await this.getLocator(locator).waitFor({ state, timeout });
  }

  protected async selectOption(
    locator: PageLocator,
    option: SelectOption,
    timeout?: number,
  ): Promise<void> {
    await this.getLocator(locator).selectOption(option, { timeout });
  }

  protected async check(locator: PageLocator, timeout?: number): Promise<void> {
    await this.getLocator(locator).check({ timeout });
  }

  protected async uncheck(locator: PageLocator, timeout?: number): Promise<void> {
    await this.getLocator(locator).uncheck({ timeout });
  }

  protected async press(locator: PageLocator, key: string, timeout?: number): Promise<void> {
    await this.getLocator(locator).press(key, { timeout });
  }

  protected async goto(url: string, timeout?: number): Promise<void> {
    await this.page.goto(url, { timeout });
  }

  protected async retry<T>(
    action: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const attempts = Math.max(1, options.attempts ?? 3);
    const delay = Math.max(0, options.delay ?? 250);
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await action();
      } catch (error) {
        lastError = error;

        if (attempt < attempts && delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}