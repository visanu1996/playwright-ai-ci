import { sauceDemoUrl } from '../../../config/config';
import { DriverFactory } from '../../core/DriverFactory';
import { LoginPage } from './LoginPage';

export class SDCentralize {
  public readonly loginPage: LoginPage;

  public constructor(public readonly driverFactory: DriverFactory) {
    this.loginPage = new LoginPage(driverFactory);
  }

  public async openSD(): Promise<void> {
    await this.driverFactory.start();
    await this.driverFactory.createPage('SD', sauceDemoUrl);
  }

  // TODO: Keep application actions on their page objects, for example
  // this.loginPage.loginAsStandardUser(), so their ownership stays clear.
  // TODO: Keep browser cleanup in DriverFactory rather than duplicating it here.
}