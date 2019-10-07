describe('SideNavComponent', function () {
  beforeEach(() => cy.visit('http://localhost:4200'));

  it('should display mat-sidenav-container', function () {
    cy.get('mat-sidenav-container').contains('dashboard');
  });

  it('should activate trips menu: pending trips', function () {
    cy.visit('http://localhost:4200/trips/pending');
    cy.get('#trips')
      .contains('Trips')
      .click()
      .get('a.is-active')
      .contains('Pending Requests')
      .click();
  });

  it('should activate routes menu: inventory', function () {
    cy.visit('http://localhost:4200/routes/inventory');
    cy.get('#routes')
      .contains('Routes')
      .click()
      .get('a.is-active')
      .contains('Inventory')
      .click();
  });
});
