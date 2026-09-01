describe('Protected routes', () => {
  const protectedRoutes = ['/home', '/profile', '/watch/1', '/my-list'];

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  protectedRoutes.forEach((route) => {
    it(`redirects unauthenticated ${route} to /login`, () => {
      cy.visit(route);
      cy.url({ timeout: 10000 }).should('include', '/login');
    });
  });

  it('grants access to protected routes after logging in', () => {
    cy.fixture('users').then(({ validUser }) => {
      cy.login(validUser.username, validUser.password);
    });

    cy.visit('/home');
    cy.url({ timeout: 10000 }).should('include', '/home');
  });
});
