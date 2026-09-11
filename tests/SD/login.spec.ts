import { test, expect } from '@playwright/test';
import { DriverFactory } from '../../src/core/DriverFactory';
import { SDCentralize } from '../../src/pages/SD/SDCentralize';

test.describe('Sauce Demo login', () => {
    let driverFactory: DriverFactory;
    let sd: SDCentralize;

    test.beforeEach(async () => {
        driverFactory = new DriverFactory();
        sd = new SDCentralize(driverFactory);
        await sd.openSD();
    });

    test.afterEach(async () => {
        await driverFactory.close();
    });

    test('logs in with a standard user', async () => {
        await sd.loginPage.loginAsStandardUser();
        await expect(sd.loginPage.page).toHaveURL(/inventory\.html/);
    });

    test('shows an error for a locked-out user', async () => {
        await sd.loginPage.loginAsLockedOutUser();

        await sd.loginPage.expectLoginError(
            'Epic sadface: Sorry, this user has been locked out.',
        );
    });

    test('shows an error when the username is empty', async () => {
        await sd.loginPage.login('', 'secret_sauce');
        await sd.loginPage.expectLoginError('Epic sadface: Username is required');
    });

    test('shows an error when the password is empty', async () => {
        await sd.loginPage.login('standard_user', '');
        await sd.loginPage.expectLoginError('Epic sadface: Password is required');
    });
});
