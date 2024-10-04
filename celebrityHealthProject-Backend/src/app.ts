import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { db } from './models/index';
import { exec } from 'child_process';
import util from 'util';
import morgan from 'morgan';
import cors from 'cors';
import { AssociateAllModels } from './models/associations';
import { OAuth2Client } from 'google-auth-library';
import { User } from './models/user';
import { Payment } from './models/payment';
import { signUserToken } from './services/auth';
import { Snowflake } from "nodejs-snowflake";
import { google } from 'googleapis';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const execPromise = util.promisify(exec);

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`${req.method} ${req.url}`, req.body);
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
//     next();
// });

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);


// Initialize Snowflake (you might want to do this once at the top of your file)
const idGenerator = new Snowflake({
    custom_epoch: 1725148800000,
    instance_id: 1
});
// import path from 'path';
//   // Load .env file

//   console.log('Current working directory:', process.cwd());
//   console.log('.env file path:', path.resolve(process.cwd(), '.env'));
  
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.SERVER_URL}/api/auth/google/callback`
  });
  
  
//   console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check if JWT_SECRET is being loaded

app.get('/api/auth/google', (req: Request, res: Response) => {
    console.log('Google OAuth initiation route hit');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('SERVER_URL:', process.env.SERVER_URL);

    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      redirect_uri: `${process.env.SERVER_URL}/api/auth/google/callback`
    });
    res.redirect(authUrl);
  });

  app.get('/api/auth/google/callback', async (req: Request, res: Response) => {
    console.log('Google OAuth callback route hit');
    const { code } = req.query;
    
    if (!code) {
      console.error('Missing authorization code');
      return sendResponse(res, {
        type: 'GOOGLE_AUTH_ERROR',
        error: 'Missing authorization code'
      });
    }

    console.log('OAuth callback route hit');
  
    try {
      console.log('Attempting to exchange code for tokens');
      const { tokens } = await client.getToken(code as string);
      console.log('Tokens received');
      client.setCredentials(tokens);
  
      console.log('Fetching user info');
      const oauth2 = google.oauth2({ version: 'v2', auth: client });
      const { data } = await oauth2.userinfo.get();
  
      console.log('Received user data:', data);
  
      let user = await User.findOne({ where: { email: data.email || '' } });
  
      if (!user) {
        user = await User.create({
          userId: idGenerator.getUniqueID().toString(),
          email: data.email || '',
          name: data.name || '',
          imgUrl: data.picture || '',
          isGoogleAuth: true,
          tier: 'Just Looking',
          paymentFrequency: 'monthly',
          dateOfBirth: '01/01/1990',
        });
        console.log(`New user created: ${user.userId}`);
      } else {
        console.log(`Existing user found: ${user.userId}`);
         // Update user information if needed
         user.name = data.name || user.name;
        //  user.imgUrl = data.picture || user.imgUrl;
        // Only update imgUrl if it's not already set to a custom image
            if (!user.imgUrl || user.imgUrl.startsWith('https://lh3.googleusercontent.com/')) {
                user.imgUrl = data.picture || user.imgUrl;
            }
         await user.save();
      }
  
      const token = await signUserToken(user);
  
      console.log(`Successful authentication for user: ${user.userId}`);
  
      return sendResponse(res, {
        type: 'GOOGLE_AUTH_SUCCESS',
        payload: {
          token: token,
          user: {
            userId: user.userId,
            email: user.email,
            name: user.name,
            tier: user.tier,
            billing: user.paymentFrequency
          }
        }
      });
  
    } catch (error) {
      console.error('Detailed error during Google authentication:', error);
      return sendResponse(res, {
        type: 'GOOGLE_AUTH_ERROR',
        error: 'Authentication failed'
      });
    }
  });


function sendResponse(res: Response, data: any) {
    console.log('Backend: Preparing to send response:', data);
    const responseHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Complete</title>
        <script>
          function sendMessageToOpener() {
            if (window.opener && !window.opener.closed) {
              console.log('window.opener is available');
              window.opener.postMessage(${JSON.stringify(data)}, '*');
              console.log('Message sent to opener');
              setTimeout(() => window.close(), 1000);
            } else {
              console.log('window.opener is not available');
              // Handle this scenario if needed
            }
          }
        </script>
      </head>
      <body onload="sendMessageToOpener()">
        <h1>Authentication Complete</h1>
        <p>Please wait while we process your login...</p>
      </body>
      </html>
    `;
    console.log('Backend: Sending HTML response');
    res.send(responseHtml);
  }

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running' });
  });

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});

// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`${req.method} ${req.url}`, req.body);
//     next();
// });



// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



// Enable pre-flight across all routes
// app.options('*', cors());
// app.options('*', cors(), (req, res) => {
//     console.log('Pre-flight OPTIONS request handled');
//     res.sendStatus(204);
// });

// Initialize models and set up associations
AssociateAllModels(db);



console.log('OAuth Client initialized with:');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '[REDACTED]' : 'Missing');
console.log('Redirect URI:', `${process.env.SERVER_URL}/api/auth/google/callback`);



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

        AssociateAllModels(db);
        console.log("Model associations set up successfully");

        // Sync the models with the database
        await db.sync({ alter: true });

        console.log("Database initialization completed successfully");
    } catch (error) {
        console.error("Error during database initialization:", error);
        process.exit(1);
    }
}

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


export default app;    