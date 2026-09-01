describe('Register', () => {
  it('registers a new user and redirects to login', () => {
    const user = {
      username: `cypress_tester_1`,
      password: 'Test123456',
    };

    cy.register(user);

    cy.visit('/login');

    cy.url({ timeout: 5000 }).should('include', '/login');
  });

  it('shows client-side validation errors without any network call', () => {
    cy.visit('/register');
    cy.get('#reg-username').type('ab');
    cy.get('#reg-email').type('valid@test.com');
    cy.get('#reg-password').type('12345');
    cy.get('#reg-confirm').type('654321');
    cy.get('button[type="submit"]').click();
    cy.contains('Username minimal 3 karakter').should('be.visible');
    cy.contains('Kata sandi minimal 6 karakter').should('be.visible');
    cy.contains('Konfirmasi kata sandi tidak cocok').should('be.visible');
  });
});
