// Import the 'express' module
import express from 'express';
import { PORT } from './config';

// Create an Express application
const app = express();

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send a response to the client
  res.send('Hello ====> Hi ');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server prajwal is running on http://localhost:${PORT}`);
});