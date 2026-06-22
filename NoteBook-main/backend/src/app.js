import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import ApiError from "./utils/ApiError.js";
import errorHandler from "./utils/errorHandler.js";
import { jwtAuthMiddleware } from "./middlewares/auth.middleware.js";

// Routes
import user from "./routes/user.routes.js";
import notes from "./routes/notes.routes.js";

const app = express();

// ----------- Middlewares ----------
const allowedOrigins = [
  "http://localhost:5173",
  "https://notebook-1-3o9c.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy: Origin not allowed"), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.options("*", cors());

app.use(bodyParser.json());

// -------- API Routes --------
app.use("/api/v1/user", user);
app.use("/api/v1/notes", jwtAuthMiddleware, notes);

// -------- Root Route --------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notebook Backend API Running",
  });
});

// -------- API 404 --------
app.use("/api/*", (req, res, next) => {
  const err = new ApiError(
    404,
    "fail",
    `Can't find ${req.originalUrl} on the server`
  );
  next(err);
});

// -------- Error Handler --------
app.use(errorHandler);

export default app;