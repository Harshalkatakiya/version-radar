import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Version from "./models/version.js";
dotenv.config();

const SOFTWARE_URL: string = process.env.SOFTWARE_URL || "";
const SOFTWARE_NAME: string = process.env.SOFTWARE_NAME || "Software";
const SOFTWARE_SELECTOR: string = process.env.SOFTWARE_SELECTOR || "";
const VERSION_REGEX: string = process.env.VERSION_REGEX || "\\d+(\\.\\d+)+";
const VERSION_FORMAT: string = process.env.VERSION_FORMAT || "X.Y";

export async function scrapeVersion(): Promise<void> {
  try {
    const { data } = await axios.get(SOFTWARE_URL);
    const $ = cheerio.load(data);

    const versionElements = $(SOFTWARE_SELECTOR);

    const versionPattern = new RegExp(VERSION_REGEX);

    const versionsFound: string[] = [];

    versionElements.each((index, element) => {
      const text = $(element).text().trim();
      const matches = text.match(versionPattern);
      if (matches) {
        matches.forEach((match) => {
          versionsFound.push(match);
        });
      }
    });

    if (versionsFound.length === 0) {
      console.log("❌ No version numbers found on the page.");
      return;
    }

    let selectedVersion: string | undefined;

    if (VERSION_FORMAT === "X.Y") {
      // Match versions like "2.10"
      selectedVersion = versionsFound.find((v) => /^\d+\.\d+$/.test(v));
    } else if (VERSION_FORMAT === "X.Y.Z") {
      // Match versions like "13.17.0"
      selectedVersion = versionsFound.find((v) => /^\d+\.\d+\.\d+$/.test(v));
    } else if (VERSION_FORMAT === "X.Y.Z.W") {
      // Match versions like "13.17.0.42"
      selectedVersion = versionsFound.find((v) =>
        /^\d+\.\d+\.\d+\.\d+$/.test(v)
      );
    } else {
      // If no format specified, pick the first version found
      selectedVersion = versionsFound[0];
    }

    if (!selectedVersion) {
      console.log("❌ No version matching the specified format found.");
      return;
    }

    console.log(`✅ Selected version: ${selectedVersion}`);

    await mongoose.connect(process.env.MONGODB_URI || "");

    const existingVersion = await Version.findOne({
      softwareName: SOFTWARE_NAME,
    });

    if (!existingVersion || existingVersion.version !== selectedVersion) {
      await Version.findOneAndUpdate(
        { softwareName: SOFTWARE_NAME },
        { version: selectedVersion },
        { upsert: true, new: true }
      );

      await sendEmailNotification(selectedVersion);

      console.log(`✅ New version detected: ${selectedVersion}`);
    } else {
      console.log("❌ No new version detected.");
    }
  } catch (error) {
    console.error("💥 Error in scraping version: ", error);
  } finally {
    await mongoose.connection.close();
  }
}

async function sendEmailNotification(version: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASS || "",
    },
  });
  const mailOptions = {
    from: `"Version Radar" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL || "",
    subject: `New ${SOFTWARE_NAME} Version Available`,
    text: `A new version of the ${SOFTWARE_NAME} is available: ${version}`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent: ", info.response);
}
