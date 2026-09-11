import {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  LaunchOptions,
  Page,
  chromium,
} from '@playwright/test';

export interface DriverFactoryOptions {
  headless?: boolean;
  launchOptions?: LaunchOptions;
  contextOptions?: BrowserContextOptions;
}

export class DriverFactory {
  private browser?: Browser;
  private context?: BrowserContext;

  public page?: Page;
  public readonly pages: Record<string, Page> = {};

  public constructor(private readonly options: DriverFactoryOptions = {}) { }

  public async start(): Promise<this> {
    if (this.browser && this.context) {
      return this;
    }

    this.browser = await chromium.launch({
      headless: this.options.headless ?? false,
      args: ['--start-maximized'],
      ...this.options.launchOptions,
    });

    this.context = await this.browser.newContext({
      viewport: null,
      ...this.options.contextOptions,
    });

    return this;
  }

  public async createPage(name: string, url: string): Promise<Page> {
    if (!this.context) {
      throw new Error('DriverFactory must be started before creating a page.');
    }

    if (this.pages[name]) {
      throw new Error(`A page named "${name}" already exists.`);
    }

    const page = await this.context.newPage();
    await page.goto(url);
    this.page = page;
    this.pages[name] = page;

    return page;
  }

  public async close(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();

    this.page = undefined;
    Object.keys(this.pages).forEach((name) => delete this.pages[name]);
    this.context = undefined;
    this.browser = undefined;
  }
}
