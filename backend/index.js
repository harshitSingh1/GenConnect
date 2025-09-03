// backend\index.js
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 8080;

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});