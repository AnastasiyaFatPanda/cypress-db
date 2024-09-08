interface User {
  _id?: string;
  name: string;
  email: string;
  age: number;
}

describe('Database Testing with Cypress-Postgres', () => {
  it('Should retrieve users from PostgreSQL', () => {
    // Execute the query using cy.task
    cy.getUsers().then((result: { rows: User[] }) => {
      // Perform assertions on the result
      expect(result.rows).to.have.length.greaterThan(0);
      expect(result.rows[0]).to.have.property('email');
      expect(result.rows[0]).to.have.property('age');
    });
  });

  // Read and verify the created user
  it('should read and verify the created user', () => {
    const where = `WHERE email = 'mail@mail.com'`;

    cy.getUsersWhere(where).then((result: { rows: User[] }) => {
      expect(result.rows.length).to.eq(1);
      expect(result.rows[0].name).to.eq('Bob');
      expect(result.rows[0].age).to.eq(25);
    });
  });
});

describe('Database Testing with MongoDB', () => {
  before(() => {
    // Connect to MongoDB before any tests run
    cy.task('connectToMongo');
  });

  after(() => {
    // Disconnect from MongoDB after all tests have finished
    cy.task('disconnectMongo');
  });

  it('Should retrieve users from MongoDB', () => {
    // Execute the query using cy.task
    cy.getUsersMongo().then((result: User[]) => {
      // Perform assertions on the result
      expect(result).to.have.length.greaterThan(0);
      expect(result[0]).to.have.property('email');
      expect(result[0]).to.have.property('age');
    });
  });

  // Read and verify the created user
  it('should read and verify the created user', () => {
    const find = { name: 'UserName' };
    cy.getUsersMongo(find).then((result: User[]) => {
      expect(result.length).to.eq(1);
      expect(result[0]).to.have.property('_id');
      expect(result[0].age).to.eq(23);
      expect(result[0].email).to.eq('UserEmail@mail.com');
    });
  });

  it('should send a request to create a user and verify the data in the MongoDB database', () => {
    const newUser = {
      name: 'John Doe',
      email: `john.doe${Math.round(Math.random() * 1000)}@example.com`,
      age: Math.round(Math.random() * 10),
    };
    cy.request('POST', '/api/users/create', newUser).then((response) => {
      expect(response.status).to.eq(201); // Verify API response status

      // Verify the user was created in the database
      const find = { email: newUser.email };
      cy.getUsersMongo(find).then((result: User[]) => {
        expect(result.length).to.eq(1);
        expect(result[0]).to.have.property('_id');
        expect(result[0].age).to.eq(newUser.age);
        expect(result[0].name).to.eq(newUser.name);

        // try to create with the same data
        cy.request({ method: 'POST', url: '/api/users/create', failOnStatusCode: false, body: newUser }).then((response) => {
          expect(response.status).to.eq(500); // Verify API response status

          // delete this user
          cy.request('DELETE', '/api/users/delete', { _id: result[0]._id }).then((response) => {
            expect(response.status).to.eq(200);

            const find = { email: newUser.email };
            cy.getUsersMongo(find).then((result: User[]) => {
              expect(result.length).to.eq(0);
            });
          });
        });
      });
    });
  });
});

// describe('Validate Unique Email Constraint', () => {
//   it('should not allow two users with the same email', () => {
//     const user = {
//       name: 'Alice',
//       email: 'alice@example.com',
//       age: 25,
//       role: 'Admin',
//     };

//     // First user creation
//     cy.request('POST', '/api/users', user).then((response) => {
//       expect(response.status).to.eq(201);

//       // Try to create another user with the same email
//       cy.request({
//         method: 'POST',
//         url: '/api/users',
//         body: user,
//         failOnStatusCode: false,
//       }).then((response) => {
//         expect(response.status).to.eq(400); // Expect failure due to unique constraint
//         expect(response.body.error).to.eq('Email must be unique');
//       });
//     });
//   });
// });

// describe('Validate Age Constraints', () => {
//   it('should not allow age outside the valid range', () => {
//     const invalidUser = {
//       name: 'Invalid User',
//       email: 'invalid.user@example.com',
//       age: 17, // Below the allowed range
//       role: 'User',
//     };

//     cy.request({
//       method: 'POST',
//       url: '/api/users',
//       body: invalidUser,
//       failOnStatusCode: false,
//     }).then((response) => {
//       expect(response.status).to.eq(400); // Expect validation error
//       expect(response.body.error).to.eq('Age must be between 18 and 100');
//     });

//     const validUser = {
//       name: 'Valid User',
//       email: 'valid.user@example.com',
//       age: 25, // Within the allowed range
//       role: 'User',
//     };

//     cy.request('POST', '/api/users', validUser).then((response) => {
//       expect(response.status).to.eq(201); // Success with valid age
//     });
//   });
// });

// describe('CRUD Operations', () => {
//     let userId;

//     // Create a new user
//     it('should create a new user', () => {
//       cy.request('POST', '/api/users', {
//         name: 'CRUD User',
//         email: 'crud.user@example.com',
//         age: 35,
//         role: 'User'
//       }).then((response) => {
//         expect(response.status).to.eq(201);
//         userId = response.body.id; // Store the user ID for later tests
//       });
//     });

//     // Read and verify the created user
//     it('should read and verify the created user', () => {
//       const query = `SELECT * FROM Users WHERE email = 'crud.user@example.com'`;
//       cy.task('queryDb', query).then((result) => {
//         expect(result[0].name).to.eq('CRUD User');
//         expect(result[0].email).to.eq('crud.user@example.com');
//       });
//     });

//     // Update the user
//     it('should update the user role', () => {
//       cy.request('PUT', `/api/users/${userId}`, {
//         role: 'Admin'
//       }).then((response) => {
//         expect(response.status).to.eq(200);

//         const query = `SELECT * FROM Users WHERE id = ${userId}`;
//         cy.task('queryDb', query).then((result) => {
//           expect(result[0].role).to.eq('Admin'); // Verify the updated role
//         });
//       });
//     });

//     // Delete the user
//     it('should delete the user', () => {
//       cy.request('DELETE', `/api/users/${userId}`).then((response) => {
//         expect(response.status).to.eq(200);

//         const query = `SELECT * FROM Users WHERE id = ${userId}`;
//         cy.task('queryDb', query).then((result) => {
//           expect(result.length).to.eq(0); // Verify the user was deleted
//         });
//       });
//     });
//   });

// describe('CRUD Operations', () => {
//   let userId;

// // Create a new user
// it('should create a new user', () => {
//   cy.request('POST', '/api/users', {
//     name: 'CRUD User',
//     email: 'crud.user@example.com',
//     age: 35,
//     role: 'User'
//   }).then((response) => {
//     expect(response.status).to.eq(201);
//     userId = response.body.id; // Store the user ID for later tests
//   });
// });

// // Read and verify the created user
// it('should read and verify the created user', () => {
//   const where = `WHERE email = 'mail@mail.com'`;
//   cy.getUsersWhere(where).then((result: {rows: User[]}) => {
//     expect(result.rows.length).to.eq(1);
//     expect(result.rows[0].name).to.eq('Bob');
//     expect(result.rows[0].age).to.eq(25);
//   });
// });

// // Update the user
// it('should update the user role', () => {
//   cy.request('PUT', `/api/users/${userId}`, {
//     role: 'Admin'
//   }).then((response) => {
//     expect(response.status).to.eq(200);

//     const query = `SELECT * FROM Users WHERE id = ${userId}`;
//     cy.task('queryDb', query).then((result) => {
//       expect(result[0].role).to.eq('Admin'); // Verify the updated role
//     });
//   });
// });

// // Delete the user
// it('should delete the user', () => {
//   cy.request('DELETE', `/api/users/${userId}`).then((response) => {
//     expect(response.status).to.eq(200);

//     const query = `SELECT * FROM Users WHERE id = ${userId}`;
//     cy.task('queryDb', query).then((result) => {
//       expect(result.length).to.eq(0); // Verify the user was deleted
//     });
//   });
// });
// });
