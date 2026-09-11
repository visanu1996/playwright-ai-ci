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

  public constructor(private readonly options: DriverFactoryOptions = {}) {}

  public async start(): Promise<this> {
    if (this.browser && this.context && this.page) {
      return this;
    }

    this.browser = await chromium.launch({
      headless: this.options.headless ?? true,
      ...this.options.launchOptions,
    });

    this.context = await this.browser.newContext(this.options.contextOptions);
    this.page = await this.context.newPage();
    this.pages.main = this.page;

    return this;
  }

  public async createPage(name: string): Promise<Page> {
    if (!this.context) {
      throw new Error('DriverFactory must be started before creating a page.');
    }

    if (this.pages[name]) {
      throw new Error(`A page named "${name}" already exists.`);
    }

    const page = await this.context.newPage();
    this.pages[name] = page;

    return page;
  }

  public async close(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
    
    // this.page = undefined;
    // Object.keys(this.pages).forEach((name) => delete this.pages[name]);
    // this.context = undefined;
    // this.browser = undefined;
  }
}
