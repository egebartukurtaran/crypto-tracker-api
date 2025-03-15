//Loads environment variables from the .env file
// Starts the Express server on the configured port
// Sets up an unhandled promise rejection handler to prevent crashes
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});