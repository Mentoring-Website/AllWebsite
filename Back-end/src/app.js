
// libraries
const cors = require('cors')
const express = require('express')
const app = express()
require("dotenv").config()
const passport = require("passport");
require('../config/dbConnection')
 require("../passport");


// libraries

const mentorRouter = require('../Routes/mentorRouter')
const userRouter = require('../Routes/userRouter')
const opportunityRouter = require('../Routes/opportunityRouter');
const mailRouter = require("../Routes/mailRouter")
const menteeRouter = require("../Routes/menteeRouter");
const messageRouter = require("../Routes/messageRouter");
const commentRouter = require("../Routes/commentsRouter");
const requestRounter = require("../Routes/requestRouter")
const socialLoginRouter = require("../Routes/SocialAuthRouter");
const newsletterRouter = require('../Routes/newsletterRouter')
const passwordRouter = require('../Routes/passwordRouter')
const acceptingRouter = require('../Routes/acceptingRouter');
// const { logger } = require('../middleware/reglogger')
// const errorHandle = require('../middleware/errorLogger')
const corsOptions = require('../config/corsOptions')
const download = require('../Routes/downloadRouter')
const session = require("express-session");
const calendar = require("../Routes/calenderRouter");
const replieRouter=require("../Routes/replieRouter")
const port = process.env.PORT || 5000
const cookieParser=require("cookie-parser")

// useconst calendar = require("../Routes/calenderRouter");

// use

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",

    credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(function (req, res, next) {
   res.header("Content-Type", "application/json;charset=UTF-8");
   res.header("Access-Control-Allow-Credentials", true);
   res.header(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
 });
app.use(
  session({
    name: "session",
    secret: "cyberwolve",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // set cookie expiration time
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())

// app.use(logger)
// app.use(errorHandle);
app.use('/api/v1', passwordRouter) 
app.use('/api/v1', newsletterRouter)
app.use('/api/auth', userRouter)
app.use('/api/v1', mentorRouter)
app.use('/api/auth', acceptingRouter)
app.use('/api/opp', opportunityRouter);
app.use('/api/req', requestRounter);
app.use('/api/email', mailRouter)
app.use('/api/v1', menteeRouter);
app.use('/api/v1', messageRouter);
app.use("/auth", socialLoginRouter);
app.use('/api/v1', commentRouter);
app.use("/uploads", express.static("uploads"));
app.use('/api/v1', download)
app.use(calendar);
app.use(replieRouter)
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

app.listen(port, () => {
  console.log("The localhost is " + port)
})