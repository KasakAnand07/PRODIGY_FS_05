import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const __dirname = path.resolve(); // Simplified path resolution

// Database connection
dbConnection();

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API routes
app.use(router);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build"))); // Adjust path to match your structure

// Catch-all handler to serve the React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
