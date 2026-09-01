describe('Login', () => {
  it('log in a valid user and lands on /home', () => {
    cy.fixture('users').then(({ validUser }) => {
      cy.login(validUser.username, validUser.password);
    });

    cy.visit('/home')

    cy.url({ timeout: 10000 }).should('include', '/home');
  });

  it('rejects wrong password with an error box and stays on /login', () => {
    cy.fixture('users').then(({ invalidUser }) => {
      cy.visit('/login');
      cy.get('#login-username').type(invalidUser.username);
      cy.get('#login-password').type(invalidUser.password);
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid username or password').should('be.visible');
      cy.url().should('include', '/login');
    });
  });

  it('blocks empty required fields with client validation', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Username diperlukan').should('be.visible');
    cy.contains('Kata sandi diperlukan').should('be.visible');
  });
});
