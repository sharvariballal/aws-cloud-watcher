# AWS Expense Tracker Backend 🚀

Welcome to the backend API directory of the **AWS Expense Tracker** application! 

This backend is designed from the ground up to be completely independent, modular, and beginners-friendly. It is written entirely in **JavaScript (Node.js + Express)** to help you learn backend fundamentals, routing, controller-service patterns, and AWS SDK integrations.

---

## 📂 Folder Structure & Responsibilities

Here is the exact layout of your `server` directory and the specific responsibility of each folder:

```text
server/
├── config/              # Centralized environment configuration (AWS, DB setup)
│   ├── awsConfig.js     # Reads, validates, and exports AWS IAM credentials
│   └── db.js            # Initializes Mongoose and manages MongoDB connections
├── controllers/         # Receives API requests, validates inputs, sends JSON responses
│   ├── authController.js   # Handles registration, login, and session tokens
│   ├── budgetController.js # Manages active budget limit thresholds and states
│   ├── costController.js   # Retrieves AWS cost breakdowns
│   └── snsController.js    # Dispatches emergency alert notifications
├── middleware/          # Intermediate functions (security guards & helpers)
│   ├── authMiddleware.js   # Guards secure routes, verifies JWT tokens, extracts session info
│   └── errorHandler.js     # Global handler that catches runtime exceptions smoothly
├── models/              # Defines structured data schemas for MongoDB collections
│   ├── User.js          # User profiles, hashed passwords, and region parameters
│   └── Budget.js        # Budget limits, current actual costs, and notification states
├── routes/              # Directs incoming HTTP endpoints (like POST /register) to controllers
│   ├── authRoutes.js    # User accounts entry routes
│   ├── budgetRoutes.js  # Spending limit paths (Protected)
│   ├── costRoutes.js    # Billing history paths (Protected)
│   └── snsRoutes.js     # SNS alert dispatcher paths (Protected)
├── services/            # Dedicated layer for heavy third-party calls (AWS SDK APIs)
│   ├── cognitoService.js       # Outlines Cognito registration & login flow
│   ├── costExplorerService.js  # Outlines Cost Explorer GetCostAndUsage retrieval
│   └── snsService.js           # Outlines SNS notification publishing logic
├── utils/               # Generic utility helpers
│   └── encrypt.js       # Encapsulates password hashing (bcryptjs) operations
├── .env.example         # Template for environment variables (credentials omitted)
├── .gitignore           # Keeps credentials, logs, and node_modules out of git
├── package.json         # Lists server details, custom scripts, and dependencies
├── server.js            # App Bootloader: registers routes, mounts global middlewares, binds port
└── README.md            # Detailed educational setup guide (You are here!)
```

---

## 🗺️ Complete Request Flow Architecture

When your frontend application triggers an action, it flows sequentially through the architecture:

```text
  [ React Client ]
         │ (HTTP Request: e.g. POST /api/budget with JWT)
         ▼
    [ Route ] (routes/budgetRoutes.js matches path & extracts parameters)
         │
         ▼
 [ Auth Middleware ] (middleware/authMiddleware.js verifies authorization)
         │
         ▼
  [ Controller ] (controllers/budgetController.js coordinates response)
         │
         ▼
   [ Service ] (services/snsService.js compiles AWS input payloads)
         │
         ▼
   [ AWS SDK ] (AWS SDK Client initiates network requests to cloud)
         │
         ▼
 [ AWS Cloud Service ] (AWS SNS physically dispatches SMS message to phone)
```

---

## 🛠️ Step-by-Step Guide for Connecting Live Services

As you learn and progress, you will replace the simulation placeholders with live services. Follow this roadmap:

### 1. Connecting MongoDB (Atlas)
Currently, data is managed in temporary in-memory arrays so the server starts instantly. When you are ready for persistence:
1. Create a database cluster on **MongoDB Atlas** and copy your database URI string.
2. Open `server/.env` and insert your URI: `MONGODB_URI=mongodb+srv://...`
3. Modify **Controllers** (`authController.js` and `budgetController.js`) to replace custom mock arrays with standard Mongoose queries:
   - For signup: `const newUser = await User.create({ name, email, password: hashedPassword });`
   - For logins: `const user = await User.findOne({ email });`

### 2. Connecting Amazon Cognito
Currently, Cognito registers and signs in users with mock status responses. When you are ready:
1. Create a **Cognito User Pool** in the AWS console and note down the **User Pool ID** and **App Client ID**.
2. Add these to your `.env` file under `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID`.
3. Open `services/cognitoService.js` and:
   - Uncomment the `@aws-sdk/client-cognito-identity-provider` imports.
   - Initialize the `CognitoIdentityProviderClient` using credentials.
   - Use `SignUpCommand` inside the register action and `InitiateAuthCommand` for login.

### 3. Connecting AWS Cost Explorer
Currently, Cost Explorer returns mock cost breakdown lists. When you are ready:
1. Ensure your AWS IAM user credentials have the `ce:GetCostAndUsage` policy attached.
2. Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` in `.env`.
3. Open `services/costExplorerService.js` and:
   - Uncomment the `@aws-sdk/client-cost-explorer` imports.
   - Initialize `CostExplorerClient`.
   - Update `getAWSExpenses()` to dynamically call `GetCostAndUsageCommand` with correct date ranges.

### 4. Connecting Amazon SNS (SMS Alerts)
Currently, SNS logs alerts to the node terminal. When you are ready:
1. Create a standard **SNS Topic** in AWS, subscribe your mobile number/email to it, and copy the Topic ARN.
2. Insert your topic ARN into `.env`: `SNS_TOPIC_ARN=arn:aws:sns:...`
3. Open `services/snsService.js` and:
   - Uncomment `@aws-sdk/client-sns`.
   - Initialize `SNSClient`.
   - Create and dispatch the `PublishCommand` using your `SNS_TOPIC_ARN`.

### 5. Adding Amazon CloudWatch Metrics (Future Enhancement)
To monitor active cloud infrastructure instances:
1. Install `@aws-sdk/client-cloudwatch` inside your backend folder.
2. Create a new service file: `services/cloudwatchService.js`.
3. Create a new route and controller: `routes/metricRoutes.js` and `controllers/metricController.js`.
4. Use the `GetMetricDataCommand` from the CloudWatch SDK to fetch EC2 CPU utilization or request counts and return them to the client.

---

## ⚙️ Quick Start Installation

This backend is completely self-contained and isolated. You can run it beside your React client:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure your environment**:
   - Duplicate `.env.example` and name the new file `.env`.
   - Populating keys is optional for local development (default simulated backups will execute).
   ```bash
   cp .env.example .env
   ```

3. **Launch the API Server**:
   - For production:
     ```bash
     npm start
     ```
   - For development (with hot reload enabled via `nodemon`):
     ```bash
     npm run dev
     ```

Your server will boot on `http://localhost:5000` with status checkpoints printed cleanly in your command shell!
