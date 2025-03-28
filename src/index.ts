// Import the 'express' module
import express from 'express';

// Create an Express application
const app = express();

// Set the port number for the server
const port = 3003;

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send a response to the client
  res.send('Hello');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server prajwal is running on http://localhost:${port}`);
});

console.log("121")

// A Step-by-Step Guide to Setting Up a Node.js Project with TypeScript
// https://medium.com/@induwara99/a-step-by-step-guide-to-setting-up-a-node-js-project-with-typescript-6df4481cb335