import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import version, { IVersion } from "./models/version.js";
import { scrapeVersion } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Version Radar 📡");
});

app.get("/current-version", async (req: Request, res: Response) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    const data: IVersion | null = await version.findOne({
      softwareName: process.env.SOFTWARE_NAME,
    });
    if (data) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "Version information not found." });
    }
  } catch (error: unknown) {
    console.error("Error fetching version information:", error);
    let errorMessage = "Error fetching version information.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  } finally {
    await mongoose.connection.close();
  }
});

cron.schedule("0 0,8,16 * * *", () => {
  console.log("⏳ Running scheduled task...");
  scrapeVersion();
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
