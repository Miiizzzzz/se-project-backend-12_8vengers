const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const cookieParser = require("cookie-parser")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

  //Load env vars
  dotenv.config({ path: './config/config.env' });

  //connect to database
  connectDB();

//Route files
const coWorkingSpaces = require('./routes/coWorkingSpaces');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');

  const app = express();

//Body parser
app.use(express.json());
//Sanitize data
app.use(mongoSanitize());
//Set security headers
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter=rateLimit({
  windowsMs:10*60*1000, //10 mins 
  max:100
});
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
app.use(cors());

  //Cookie parser
  app.use(cookieParser());

  //Mount routers
  app.use('/api/v1/coWorkingSpaces', coWorkingSpaces);
  app.use('/api/v1/auth',auth);
  app.use('/api/v1/reservations', reservations)

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT,console.log('Server running in', process.env.NODE_ENV, 'on '+ process.env.HOST + ":" + PORT));

  process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
  });
