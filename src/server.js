const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();

const prisma = require('./config/prisma');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet());
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET || "temporary_session_secret",
      resave: false,
      saveUninitialized: false,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 200, // tối đa 200 request / 15 phút / IP
    message: {
      message: "Bạn gửi quá nhiều request. Vui lòng thử lại sau.",
    },
  });
  
app.use(globalLimiter);

app.get("/", (req, res) => {
    res.json({
        message: "JWT Auth Service is running",
    })
});


app.get("/api/test-db", async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json({
            message: "Database connected successfully",
            users,
        });
    } catch(error) {
        res.status(500).json({
            message : "Database connection failed",
            error: error.message,
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});