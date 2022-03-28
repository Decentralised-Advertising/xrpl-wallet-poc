describe('browser-extension-home', () => {
  beforeEach(() => cy.visit('/'));

  it('should display a welcome message', () => {
    cy.get('[data-cy="welcome-title"]').contains(
      'Welcome to the DA Browser Extension'
    );
  });
});
