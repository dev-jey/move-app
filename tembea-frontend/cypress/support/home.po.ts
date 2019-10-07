export const navigateToHome = () => cy.visit('/');
export const logo = () => cy.get('.logo img');
export const homeImage = () => cy.get('.image-wrapper img');
export const mantra = () => cy.get('.mantra p');
export const subMantra = () => cy.get('.sub-mantra p');
export const loginButton = () => cy.get('.login-button button');
