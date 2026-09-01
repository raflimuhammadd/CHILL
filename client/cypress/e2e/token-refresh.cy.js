describe('Token refresh', () => {
  it('restores the session from refresh cookie when access token is missing', () => {
    cy.fixture('users').then(({ validUser }) => {
      cy.login(validUser.username, validUser.password);
    });

    cy.clearLocalStorage('accessToken');
    cy.visit('/home');
    cy.url({ timeout: 10000 }).should('include', '/home');
  });
});
