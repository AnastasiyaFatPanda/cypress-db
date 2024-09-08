const { defineConfig } = require('cypress');
const { Client } = require('pg'); // Using pg directly as an alternative
const { MongoClient } = require('mongodb');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // sql connection
      let client;
      // MONGODB connection
      let mongoDbClient;
      let db;

      // Establish the connection once before running tests and close it after all tests have completed.
      on('before:run', async () => {
        // Establish a single connection before tests start
        client = new Client(config.env.db);
        console.log('/\n\n\n\n\\\n\n\\nn\n\n\n\n\\n\nREQUEST!!!!!');
        await client.connect();
      });

      on('after:run', async () => {
        // Close the connection after all tests complete
        await client.end();
      });

      on('task', {
        async sqlQuery({ query }) {
          try {
            const result = await client.query(query);
            return result;
          } catch (err) {
            console.error('Database query failed:', err);
            throw err;
          }
        },
        async connectToMongo() {
          mongoDbClient = await MongoClient.connect(config.env.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          db = mongoDbClient.db(config.env.mongoDbName);
          return null;
        },
        // Task to disconnect from MongoDB
        async disconnectMongo() {
          await mongoDbClient.close();
          return null;
        },
        // Task to fetch users from MongoDB
        async getUsersMongo(find = {}) {
          const users = await db
            .collection('users')
            .find(find || {})
            .toArray();
          return users;
        },
      });

      return config;
    },
    baseUrl: 'http://localhost:3000',  // Adjust as needed
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Adjust pattern as needed
    supportFile: 'cypress/support/e2e.js', // Or false if you don't have a support file
  },
});
