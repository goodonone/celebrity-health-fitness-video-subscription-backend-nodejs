import express from 'express';
import { db } from './models';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

const app = express();

// const cors = require('cors');

// // Enable CORS for all routes
// app.use(cors());

// // Optionally, configure CORS with specific settings
// app.use(cors({
//   origin: 'http://localhost:4200', 
//   methods: 'GET,POST,PUT,DELETE',  
//   allowedHeaders: 'Content-Type,Authorization'  // Allow these headers
// }));

// ... (rest of your express setup)

async function runCommand(command: string) {
    try {
        const { stdout, stderr } = await execPromise(command);
        console.log('stdout:', stdout);
        if (stderr) console.error('stderr:', stderr);
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        throw error;
    }
}

async function initializeDatabase() {
    try {
        console.log('Running migrations...');
        await runCommand('npx sequelize-cli db:migrate --config src/config/config.json');
        console.log('Migrations completed successfully.');

        console.log('Running seeders...');
        await runCommand('npx sequelize-cli db:seed:all --config src/config/config.json');
        console.log('Seeding completed successfully.');

        console.log("Database initialization completed successfully");
    } catch (error) {
        console.error("Error during database initialization:", error);
        process.exit(1);
    }
}

// Initialize database and start the server
initializeDatabase().then(() => {
    // Syncing our database
    db.sync({ alter: true }).then(() => {
        console.info("connected to the database!")
        // Start the server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    });
}).catch(error => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
});