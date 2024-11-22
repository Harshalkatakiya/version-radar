# Version Radar 📡

Version Radar is a dynamic Node.js (TypeScript) application that monitors a software's webpage for version updates. It:

- **Web-scrapes** the specified URL to extract the software version.
- **Stores** the version information in a MongoDB database.
- **Schedules** the scraping task to run 3 times a day.
- **Updates** the database if a new version is detected.
- **Sends email notifications** when a new version is available.
- **Provides an API** to access the current version

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)
- [Disclaimer](#disclaimer)

---

## Features

- **Dynamic Web Scraping**: Uses Cheerio to scrape dynamic elements from a webpage.
- **Version Detection**: Extracts and identifies software version numbers using regular expressions.
- **Database Storage**: Stores and updates version information in MongoDB.
- **Email Notifications**: Sends an email alert when a new version is detected.
- **Scheduling**: Runs the scraping task at specified times using `node-cron`.
- **Express Server with API Endpoints**: Provides an API to access the current version.
- **Configuration via Environment Variables**: Easily adjust settings without changing the code.

---

## Prerequisites

- **Node.js** (v12 or higher)
- **npm** (Node Package Manager)
- **MongoDB** database (local or hosted, e.g., MongoDB Atlas)
- **Email Account** (for sending notifications, e.g., Gmail)

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Harshalkatakiya/version-radar.git
   cd version-radar
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

---

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```dotenv
# Application Configuration
PORT=3000
SOFTWARE_URL=https://example.com/software-page
SOFTWARE_NAME=SoftwareName
SOFTWARE_SELECTOR=.your-css-selector
VERSION_REGEX=\d+(\.\d+)+
VERSION_FORMAT=X.Y

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Email Configuration
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
RECIPIENT_EMAIL=recipient_email@example.com
```

- **`PORT`**: The port on which the server will run (default is `3000`).
- **`SOFTWARE_URL`**: The URL of the software page to scrape.
- **`SOFTWARE_NAME`**: Name of the software you're tracking.
- **`SOFTWARE_SELECTOR`**: CSS selector to target elements containing version numbers.
- **`VERSION_REGEX`**: Regular expression to match version numbers.
- **`VERSION_FORMAT`**: Expected version format (`X.Y`, `X.Y.Z`, etc.).
- **`MONGODB_URI`**: Connection string for your MongoDB database.
- **`EMAIL_USER` and `EMAIL_PASS`**: Credentials for the email account used to send notifications.
- **`RECIPIENT_EMAIL`**: Email address to receive notifications.

### 2. Email Account Setup

For Gmail accounts:

- Enable Less Secure Apps or use an App Password.
- Ensure that 2-Step Verification is set up if using App Passwords.

---

## Usage

### 1. Start the Application

```bash
npm start
```

The will compile the TypeScript code and start the server. It will start on the specified `PORT` (default `3000`).

### 2. Scheduling

The application uses `node-cron` to schedule the scraping task. By default, it runs at `00:00`, `08:00`, and `16:00` every day. You can adjust the schedule in `src/index.ts`:

```typescript
cron.schedule("0 0,8,16 * * *", () => {
  console.log("⏳ Running scheduled task...");
  scrapeVersion();
});
```

---

## API Endpoints

### 1\. Home Route

- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns a welcome message.
- **Response**:

  ```css
  Welcome to Version Radar 📡
  ```

### 2\. Current Version Route

- **URL**: `/current-version`
- **Method**: `GET`
- **Description**: Retrieves the current version information from the database.
- **Response**:

  - **Success (200)**:

    ```json
    {
      "data": {
        "_id": "60f7f0b4c2a1a45b6c8e4d1a",
        "softwareName": "SoftwareName",
        "version": "2.10",
        "updatedAt": "2024-11-22T12:34:56.789Z",
        "createdAt": "2024-11-22T12:34:56.789Z",
        "__v": 0
      }
    }
    ```

  - **Not Found (404)**:

    ```json
    {
      "message": "Version information not found."
    }
    ```

  - **Error (500)**:

    ```json
    {
      "message": "Error fetching version information."
    }
    ```

---

## Troubleshooting

### Common Issues

#### 1. No Version Detected

- **Cause**: The version number is not being correctly extracted.
- **Solution**:
  - Check the `SOFTWARE_SELECTOR` to ensure it's targeting the correct elements.
  - Adjust the `VERSION_REGEX` to match the version format on the webpage.
  - Use console logs to debug the elements and text being processed.

#### 2. Email Not Sent

- **Cause**: Incorrect email configuration or authentication issues.
- **Solution**:
  - Verify `EMAIL_USER`, `EMAIL_PASS`, and `RECIPIENT_EMAIL` in your `.env` file.
  - Ensure that your email account allows SMTP access.
  - Check for any security notifications from your email provider.

#### 3. MongoDB Connection Fails

- **Cause**: Incorrect MongoDB URI or network issues.
- **Solution**:
  - Verify the `MONGODB_URI` in your `.env` file.
  - Ensure that your MongoDB instance is running and accessible.
  - Check for any IP whitelist or network restrictions in MongoDB Atlas.

---

## Project Structure

```bash
version-radar/
├── src/
│   ├── models/
│   │   └── version.ts
│   ├── index.ts
│   └── scraper.ts
├── .env
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── tsconfig.json
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

   Click on the 'Fork' button at the top right corner of the repository page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/Harshalkatakiya/version-radar.git
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
5. **Commit Your Changes**

   ```bash
   git commit -m 'Add new feature'
   ```

6. **Push to the Branch**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

   Go to the original repository and click on 'New Pull Request'.

---

## License

This project is licensed under the [MIT](LICENSE) License.

---

## Acknowledgements

- **Node.js**: Runtime environment for executing JavaScript code server-side.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Cheerio**: Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Node-Cron**: Task scheduler for Node.js.
- **Nodemailer**: Module for Node.js applications to allow easy email sending.
- **dotenv**: Module that loads environment variables from a `.env` file.

---

## Contact

For any questions or suggestions, please open an issue or contact [Harshal Katakiya](https://github.com/Harshalkatakiya).

---

## Disclaimer

This project is intended for educational and personal use. Please ensure that you have the right to scrape the target website and comply with their terms of service.

---

### Thank you for using Version Radar! If you find this project useful, please give it a star on GitHub. ⭐

Happy coding! 🚀
