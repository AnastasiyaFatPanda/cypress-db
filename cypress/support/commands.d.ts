// cypress/support/commands.d.ts

/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to fetch active users from the database.
       * @example cy.getUsers()
       */
      getUsers(): Chainable<any>; // Adjust the type as needed based on the return value
      getUsersWhere(where: string): Chainable<any>; // Adjust the type as needed based on the return value
      getUsersMongo(find?: any): Chainable<any>;
    }
  }
  