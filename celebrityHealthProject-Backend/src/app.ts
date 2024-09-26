// import express, { NextFunction, Request, Response } from 'express';
// // import { db } from './models';
// import { db } from './models/index';
// import { exec } from 'child_process';
// import util from 'util';
// import path from 'path';
// import morgan from 'morgan';
// import userRoutes from './routes/userRoutes';
// import productRoutes from './routes/productRoutes';
// import cartRoutes from './routes/cartRoutes';
// import paymentRoutes from './routes/paymentRoutes';
// import { AssociateAllModels } from './models/associations';
// import { Sequelize } from 'sequelize';
// import config from './config/config.json';


// const execPromise = util.promisify(exec);

// const app = express();


// const cors = require('cors');
// app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:4200', // Only allow Angular app
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
//   }));

// app.use(morgan('dev'));

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// // routes
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/payment', paymentRoutes);

// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.status(404).end();
// });

// // Syncing our database
// // db.sync({ alter: true }).then(() => {
// // //db.sync().then(() => {
// //     console.info("connected to the database!")
// // });

// // app.listen(3001);
// // app.listen(3000);

// // app.listen(3000, () => {
// //     console.log("Server is running on http://localhost:3000");
// //   });

// app.options('*', cors());  // Enable pre-flight across all routes

// // const sequelize = new Sequelize(/* your database config */);

// // Initialize models and set up associations
// const models = AssociateAllModels(db);

// async function runCommand(command: string) {
//     try {
//         const { stdout, stderr } = await execPromise(command);
//         console.log('stdout:', stdout);
//         if (stderr) console.error('stderr:', stderr);
//     } catch (error) {
//         console.error(`Error executing command: ${command}`);
//         throw error;
//     }
// }

// // async function initializeDatabase() {
// //     try {
// //         console.log('Running migrations...');
// //         await runCommand('npx sequelize-cli db:migrate --config src/config/config.json');
// //         console.log('Migrations completed successfully.');

// //         console.log('Running seeders...');
// //         await runCommand('npx sequelize-cli db:seed:all --config src/config/config.json');
// //         console.log('Seeding completed successfully.');

// //         // Initialize models and set up associations
// //         const models = AssociateAllModels(sequelize);

// //         // AssociateAllModels();  // Uncomment this line
// //         // console.log("Model associations set up successfully");

// //         console.log("Database initialization completed successfully");
// //     } catch (error) {
// //         console.error("Error during database initialization:", error);
// //         process.exit(1);
// //     }
// // }

// async function initializeDatabase() {
//     try {
//         await db.authenticate();
//         console.log('Connection has been established successfully.');

//         console.log('Running migrations...');
//         await runCommand('npx sequelize-cli db:migrate --config src/config/config.json');
//         console.log('Migrations completed successfully.');

//         console.log('Running seeders...');
//         await runCommand('npx sequelize-cli db:seed:all --config src/config/config.json');
//         console.log('Seeding completed successfully.');

//         console.log("Model associations set up successfully");

//         // Sync the models with the database
//         await db.sync({ alter: true });

//         console.log("Database initialization completed successfully");
//     } catch (error) {
//         console.error("Error during database initialization:", error);
//         process.exit(1);
//     }
// }

// // Initialize database and start the server
// initializeDatabase().then(() => {
//     // Syncing our database
//     db.sync({ alter: true }).then(() => {
//         console.info("connected to the database!")
//         // Start the server
//         app.listen(3000, () => {
//             console.log('Server is running on port 3000');
//         });
//     });
// }).catch(error => {
//     console.error("Failed to initialize database:", error);
//     process.exit(1);
// });

import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { db } from './models/index';
import { exec } from 'child_process';
import util from 'util';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { AssociateAllModels } from './models/associations';
import { OAuth2Client } from 'google-auth-library';
// import path from 'path';
//   // Load .env file

//   console.log('Current working directory:', process.cwd());
//   console.log('.env file path:', path.resolve(process.cwd(), '.env'));
  
  dotenv.config();
  
  
//   console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check if JWT_SECRET is being loaded

const execPromise = util.promisify(exec);

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

// CORS configuration
app.use(cors({
    origin: ['http://localhost:4200', 'https://accounts.google.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});

// Enable pre-flight across all routes
// app.options('*', cors());
app.options('*', cors(), (req, res) => {
    console.log('Pre-flight OPTIONS request handled');
    res.sendStatus(204);
});

// Initialize models and set up associations
AssociateAllModels(db);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.get('/api/auth/google/callback', async (req: Request, res: Response) => {
    const { code } = req.query;
    try {
        const { tokens } = await client.getToken(code as string);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token as string,
            audience: process.env.GOOGLE_CLIENT_ID as string
        });
        const payload = ticket.getPayload();
        
        // Implement your user creation/login logic here
        // ...

        // Send a response that will close the popup and message the opener
        res.send(`
            <script>
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', payload: ${JSON.stringify(payload)} }, '*');
                window.close();
            </script>
        `);
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).send('Authentication failed');
    }
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});

// Enable pre-flight across all routes
app.options('*', cors(), (req, res) => {
    console.log('Pre-flight OPTIONS request handled');
    res.sendStatus(204);
});


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
        await db.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Running migrations...');
        await runCommand('npx sequelize-cli db:migrate --config src/config/config.json');
        console.log('Migrations completed successfully.');

        console.log('Running seeders...');
        await runCommand('npx sequelize-cli db:seed:all --config src/config/config.json');
        console.log('Seeding completed successfully.');

        console.log("Model associations set up successfully");

        // Sync the models with the database
        await db.sync({ alter: true });

        console.log("Database initialization completed successfully");
    } catch (error) {
        console.error("Error during database initialization:", error);
        process.exit(1);
    }
}

// Initialize database and start the server
initializeDatabase()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(error => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });