import { BasePage } from '../../core/BasePage';
import { DriverFactory } from '../../core/DriverFactory';
import { SDCreds } from '../../../config/secret';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
	private readonly usernameInput = '[data-test="username"]';
	private readonly passwordInput = '[data-test="password"]';
	private readonly loginButton = '[data-test="login-button"]';
	private readonly loginError = '[data-test="error"]';

	public constructor(driverFactory: DriverFactory) {
		super(driverFactory);
	}

	public async login(username: string, password: string): Promise<void> {
		await this.fillLocator(this.usernameInput, username, { isSecret: false });
		await this.fillLocator(this.passwordInput, password, { isSecret: true });
		await this.clickElement(this.loginButton);
	}

	public async loginAsStandardUser(): Promise<void> {
		await this.login(SDCreds.users.std, SDCreds.password);
	}

	public async loginAsLockedOutUser(): Promise<void> {
		await this.login(SDCreds.users.lck, SDCreds.password);
	}

	public async isLoginErrorVisible(): Promise<boolean> {
		return this.isLocatorVisible(this.loginError);
	}

	public async getLoginError(): Promise<string> {
		return this.getLocatorText(this.loginError);
	}

	public async expectLoginError(message: string | RegExp): Promise<void> {
		await expect(this.page.locator(this.loginError)).toContainText(message);
	}
}