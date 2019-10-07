import {
  navigateToHome, logo, mantra, subMantra, homeImage, loginButton
} from '../support/home.po';

describe('Landing Page Tests', () => {
  // load http://localhost:4200 before each test
  beforeEach(navigateToHome);

  it('should display Tembea logo', () => {
    logo().should('have.attr', 'src', '/assets/images/brand/logo.png');
  });
  it('should display Tembea home page image', () => {
    homeImage().should('have.attr', 'src', '/assets/images/home/tembea-image.png');
  });
  it('should display Tembea mantra text', () => {
    mantra().contains('Manage Your Rides the Andela Way.');
  });
  it('should display Tembea second mantra text', () => {
    subMantra().contains('Start your trip with Tembea');
  });
  it('should display Login button with the text "Login to Get Started"', () => {
    loginButton().contains('Login to Get Started');
  });
  beforeEach(() => cy.visit('http://localhost:4200'));
});
