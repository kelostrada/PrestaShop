require('module-alias/register');
const FOBasePage = require('@pages/FO/FObasePage');

class Login extends FOBasePage {
  constructor() {
    super();

    this.pageTitle = 'Login';

    // Selectors
    this.loginForm = '#login-form';
    this.emailInput = `${this.loginForm} input[name='email']`;
    this.passwordInput = `${this.loginForm} input[name='password']`;
    this.signInButton = `${this.loginForm} button#submit-login`;
    this.displayRegisterFormLink = '#content a[data-link-action=\'display-register-form\']';
    // Selectors for create account form
    this.createAccountForm = '#customer-form';
    this.genderRadioButton = id => `${this.createAccountForm} input[name='id_gender'][value='${id}']`;
    this.firstNameInput = `${this.createAccountForm} input[name='firstname']`;
    this.lastNameInput = `${this.createAccountForm} input[name='lastname']`;
    this.newEmailInput = `${this.createAccountForm} input[name='email']`;
    this.newPasswordInput = `${this.createAccountForm} input[name='password']`;
    this.birthdateInput = `${this.createAccountForm} input[name='birthday']`;
    this.customerPrivacyCheckbox = `${this.createAccountForm} input[name='customer_privacy']`;
    this.psgdprCheckbox = `${this.createAccountForm} input[name='psgdpr']`;
    this.partnerOfferCheckbox = `${this.createAccountForm} input[name='optin']`;
    this.companyInput = `${this.createAccountForm} input[name='company']`;
    this.saveButton = `${this.createAccountForm} .form-control-submit`;
  }

  /*
  Methods
   */

  /**
   * Login in FO
   * @param page
   * @param customer
   * @return {Promise<void>}
   */
  async customerLogin(page, customer) {
    await this.setValue(page, this.emailInput, customer.email);
    await this.setValue(page, this.passwordInput, customer.password);
    await this.clickAndWaitForNavigation(page, this.signInButton);
  }

  /**
   * Create new customer account
   * @param page
   * @param customer
   * @returns {Promise<void>}
   */
  async createAccount(page, customer) {
    await this.waitForSelectorAndClick(page, this.displayRegisterFormLink);
    await this.waitForSelectorAndClick(page, this.genderRadioButton(customer.socialTitle === 'Mr.' ? 1 : 2));
    await this.setValue(page, this.firstNameInput, customer.firstName);
    await this.setValue(page, this.lastNameInput, customer.lastName);
    await this.setValue(page, this.newEmailInput, customer.email);
    await this.setValue(page, this.newPasswordInput, customer.password);

    await this.setValue(
      page,
      this.birthdateInput,
      `${customer.monthOfBirth}/${customer.dayOfBirth}/${customer.yearOfBirth}`,
    );

    await page.click(this.customerPrivacyCheckbox);
    if (await this.elementVisible(page, this.psgdprCheckbox, 500)) {
      await page.click(this.psgdprCheckbox);
    }
    await page.click(this.saveButton);
  }

  /**
   * Go to create account page
   * @param page
   * @returns {Promise<void>}
   */
  async goToCreateAccountPage(page) {
    await this.waitForSelectorAndClick(page, this.displayRegisterFormLink);
  }

  /**
   * Is partner offer required
   * @param page
   * @returns {Promise<boolean>}
   */
  async isPartnerOfferRequired(page) {
    return this.elementVisible(page, `${this.partnerOfferCheckbox}:required`, 1000);
  }

  /**
   * Is birth date input visible
   * @param page
   * @returns {Promise<boolean>}
   */
  async isBirthDateVisible(page) {
    return this.elementVisible(page, this.birthdateInput, 1000);
  }

  /**
   * Is partner offer visible
   * @param page
   * @returns {Promise<boolean>}
   */
  async isPartnerOfferVisible(page) {
    return this.elementVisible(page, this.partnerOfferCheckbox, 1000);
  }

  /**
   * Is company input visible
   * @param page
   * @returns {Promise<boolean>}
   */
  async isCompanyInputVisible(page) {
    return this.elementVisible(page, this.companyInput, 1000);
  }
}

module.exports = new Login();
