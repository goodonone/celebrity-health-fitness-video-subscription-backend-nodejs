import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { db } from './models/index';
import { exec } from 'child_process';
import util from 'util';
import morgan from 'morgan';
import cors from 'cors';
import { AssociateAllModels } from './models/associations';
import { auth, OAuth2Client } from 'google-auth-library';
import { User } from './models/user';
import { Payment } from './models/payment';
import { signUserToken } from './services/auth';
import { Snowflake } from "nodejs-snowflake";
import { google } from 'googleapis';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { Op } from 'sequelize';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';
import imageRoutes from './routes/image.routes';
import youtubeRoutes from './routes/youtube.routes';
import path from 'path';
import fs from 'fs';
import { profile } from 'console';
import './config/firebase.config';
import authRoutes from './routes/auth.routes';

dotenv.config();

const execPromise = util.promisify(exec);

const app = express();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, '..', 'public');
console.log('Static files directory:', publicPath);
app.use(express.static(publicPath));


// app.get('/debug-list-images', (req: Request, res: Response) => {
//   const imagesPath = path.join(__dirname, '..', 'public', 'images');
//   console.log('Checking directory:', imagesPath);
//   fs.readdir(imagesPath, (err, files) => {
//     if (err) {
//       console.error('Error reading directory:', err);
//       res.status(500).send('Error reading images directory');
//     } else {
//       console.log('Files in images directory:', files);
//       res.json(files);
//     }
//   });
// });

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

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/users', authRoutes);


// Initialize Snowflake (you might want to do this once at the top of your file)
const idGenerator = new Snowflake({
    custom_epoch: 1725148800000,
    instance_id: 1
});

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.SERVER_URL}/api/auth/google/callback`
  });

app.get('/api/auth/google', (req: Request, res: Response) => {
  console.log('Google OAuth initiation route hit');
  const state = req.query.state as string;
  if (state !== 'signup' && state !== 'login') {
    return res.status(400).send('Invalid state parameter');
  }
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    redirect_uri: `${process.env.SERVER_URL}/api/auth/google/callback`,
    state: state,
    prompt: 'select_account'
  });
  res.redirect(authUrl);
});

app.get('/api/auth/google/callback', async (req: Request, res: Response) => {
  console.log('Google OAuth callback route hit');
  const { code, state } = req.query;
  
  if (!code || (state !== 'signup' && state !== 'login')) {
    console.error('Missing authorization code or invalid state');
    return sendResponse(res, {
      type: 'GOOGLE_AUTH_ERROR',
      error: 'Missing authorization code or invalid state'
    });
  }

  try {
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();

    console.log('Received user data:', data);

    await db.transaction(async (t) => {
      const existingUser = await User.findOne({
        where: { email: data.email || '' },
        transaction: t
      });

      if (state === 'signup') {
        if (existingUser) {
          return sendResponse(res, {
            type: 'GOOGLE_AUTH_ERROR',
            error: 'User already exists. Please Login instead.'
          });
        }

        const newUser = await User.create({
          userId: idGenerator.getUniqueID().toString(),
          name: data.name || '',
          email: data.email || '',
          imgUrl: data.picture || '',
          isGoogleAuth: true,
          tier: 'Just Looking',
          paymentFrequency: 'monthly',
          dateOfBirth: '01/01/1990',
        }, { transaction: t });

        const token = await signUserToken(newUser);

        return sendResponse(res, {
          type: 'GOOGLE_AUTH_SUCCESS',
          payload: {
            token: token,
            user: {
              userId: newUser.userId,
              email: newUser.email,
              name: newUser.name,
              tier: newUser.tier,
              billing: newUser.paymentFrequency,
              imgUrl: newUser.imgUrl,
            }
          }
        });
      } else { // state === 'login'
        if (!existingUser) {
          return sendResponse(res, {
            type: 'GOOGLE_AUTH_ERROR',
            error: 'User does not exist. Please sign up first.'
          });
        }

        const token = await signUserToken(existingUser);

        return sendResponse(res, {
          type: 'GOOGLE_AUTH_SUCCESS',
          payload: {
            token: token,
            user: {
              userId: existingUser.userId,
              email: existingUser.email,
              name: existingUser.name,
              tier: existingUser.tier,
              billing: existingUser.paymentFrequency,
              imgUrl: existingUser.imgUrl,
              price: existingUser.price,
              weight: existingUser.weight,
              height: existingUser.height,
              gender: existingUser.gender,
              dateOfBirth: existingUser.dateOfBirth,
              goals: existingUser.goals,
              profilePictureSettings: existingUser.profilePictureSettings,
              isGoogleAuth: existingUser.isGoogleAuth
            }
          }
        });
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

// New route for password reset request
// app.post('/api/reset-password', async (req: Request, res: Response) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const token = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
//     await user.save();

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

//     const logoPath = path.join(__dirname, '..', 'public', 'images', 'ProjectLogo.png');
//     const logoContent = fs.readFileSync(logoPath).toString('base64');

//     const msg = {
//       to: email,
//       from: process.env.SENDGRID_FROM_EMAIL!,
//       templateId: 'd-ddc19436e7f34a478444b6576038e3f7',
//       dynamicTemplateData: {
//         resetUrl: resetUrl
//       }
//     };

//     await sgMail.send(msg);

//     res.status(200).json({ message: 'Reset password instructions sent' });
//   } catch (error) {
//     console.error('Error in reset password:', error);
//     res.status(500).json({ message: 'Error in reset password process' });
//   }
// });

// New route to handle password reset
// app.post('/api/reset-password/:token', async (req: Request, res: Response) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({
//       where: {
//         resetPasswordToken: token,
//         resetPasswordExpires: { [Op.gt]: new Date() }
//       }
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
//     }

//     user.password = password;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;
//     await user.save();

//     res.status(200).json({ message: 'Password has been reset' });
//   } catch (error) {
//     console.error('Error in reset password:', error);
//     res.status(500).json({ message: 'Error in reset password process' });
//   }
// });

function sendResponse(res: Response, data: any) {
  console.log('Backend: Preparing to send response:', data);
  console.log('Current directory:', __dirname);
  const imagePath = path.join(__dirname, '..', 'public', 'images', 'ProjectLogo.png');
  console.log('Full image path:', imagePath);
  console.log('Image file exists:', fs.existsSync(imagePath));

  // Determine the background color based on the data type
  const backgroundColor = data.type === 'GOOGLE_AUTH_SUCCESS' ? '#c7ff20' : 'red';

  const responseHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authentication ${data.type === 'GOOGLE_AUTH_SUCCESS' ? 'Complete' : 'Error'}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" 
            integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" 
            crossorigin="anonymous" 
            referrerpolicy="no-referrer" 
            onerror="console.error('Failed to load Font Awesome');">
      <script>
        function sendMessageToOpener() {
          if (window.opener && !window.opener.closed) {
            console.log('window.opener is available');
            window.opener.postMessage(${JSON.stringify(data)}, '${process.env.FRONTEND_URL}');
            console.log('Message sent to opener');
            setTimeout(() => window.close(), 1500); // Close after 1.5 seconds
          } else {
            console.log('window.opener is not available');
          }
        }
      </script>

      
      <style>
        body { font-family: Times New Roman; text-align: center; padding-top: 10px; background-color: ${backgroundColor};}
        h1 { ${data.type === 'GOOGLE_AUTH_SUCCESS'}; font-size: 36px; font-weight: bold; padding-right: 21px; padding-top: 5px;}
        p { margin-top: 20px; font-size:20px; padding-right: 21px; line-height: 1.4; }
        .flexContainer { display: flex; flex-direction: row; justify-content: space-between; width: 180px;}
        .logo { max-width: 120px; height: auto; margin-bottom: 30px; text-align: left; }
        .google-icon { width: 25px; height: 25px; margin-right: 8px; padding-bottom: 30px }
        .x-icon { font-size: 12px; color: rgb(0, 0, 0); font-weight: 300;padding-top: 10px; }
      </style>
    </head>
    <body onload="sendMessageToOpener()">
      <div class="flexContainer">
       <img src="/images/ProjectLogo.png" alt="Logo" class="logo" onerror="console.error('Failed to load logo:', this.src); this.style.display='none';">
       <i class="fa-solid fa-x x-icon"></i>
       <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>

     
      <h1>${data.type === 'GOOGLE_AUTH_SUCCESS' ? 'Authentication Complete' : 'Authentication Error'}</h1>
      <p>${data.type === 'GOOGLE_AUTH_SUCCESS' 
           ? 'Please wait while we process your credentials...' 
           : data.error || 'An error occurred during authentication.'}</p>
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
        // await db.sync({ alter: true });
        if (process.env.NODE_ENV === 'development') {
          await db.sync({ alter: true });
          console.log("Database synchronized in development mode");
      }

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