const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

require("dotenv").config();

const prisma = require('./config/prisma');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "").split(",").map(o => o.trim()).filter(Boolean);
app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
);
  
app.use(passport.initialize());
app.use(passport.session());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
      message: "Bạn gửi quá nhiều request. Vui lòng thử lại sau.",
    },
  });

app.use(globalLimiter);

app.get("/", (req, res) => {
    res.json({
        message: "JWT Auth Service is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(async () => {
        await prisma.$disconnect();
        console.log("Server closed.");
        process.exit(0);
    });
});

process.on("SIGINT", async () => {
    console.log("SIGINT received. Shutting down gracefully...");
    server.close(async () => {
        await prisma.$disconnect();
        console.log("Server closed.");
        process.exit(0);
    });
});