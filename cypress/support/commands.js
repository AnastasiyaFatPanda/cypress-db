// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js

// Define a custom command to get users from the database
Cypress.Commands.add('getUsers', () => {
  const query = 'SELECT * FROM users';
  return cy.task('sqlQuery', { query });
});

Cypress.Commands.add('getUsersWhere', (where) => {
  const query = 'SELECT * FROM users ' + where;
  return cy.task('sqlQuery', { query });
});

// Create a command to fetch active users from MongoDB asynchronously
// Because Cypress commands are already promise-like, you don't need to wrap them or return your own promise.
Cypress.Commands.add('getUsersMongo', (find) => {
  // Use `cy.task` to call the `getUsersMongo` task defined in cypress.config.js
  return cy.task('getUsersMongo', find).then((users) => {
    return users;
  });
});
