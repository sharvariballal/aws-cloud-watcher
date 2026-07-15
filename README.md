# ☁️ AWS Cloud Watcher

An AWS-powered MERN application that helps users monitor their AWS cloud spending, set monthly budgets, and receive real-time alerts when costs exceed predefined limits.

This project is being built as a learning project to understand AWS cloud services, backend development, and cloud cost monitoring.

---

## 🚀 Features

### Current Features
- Modern React dashboard
- User authentication (Coming Soon)
- MongoDB Atlas integration
- Express.js REST API
- Responsive UI

### Planned AWS Features
- 🔐 Amazon Cognito Authentication
- 💰 AWS Cost Explorer Integration
- 📩 Amazon SNS SMS Notifications
- 📊 AWS CloudWatch Monitoring
- 📈 Expense Analytics Dashboard
- 🔔 Budget Threshold Alerts

---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## AWS Services
- Amazon Cognito
- AWS Cost Explorer
- Amazon SNS
- Amazon CloudWatch

---

# 📁 Project Structure

```
aws-cloud-watcher/
│
├── src/                     # React Frontend
│
├── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/aws-cloud-watcher.git
```

```
cd aws-cloud-watcher
```

---

## Install Frontend

```
npm install
```

---

## Install Backend

```
cd server
npm install
```

---

# Environment Variables

Create a `.env` file inside the `server` directory.

```
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

AWS_REGION=

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

COGNITO_USER_POOL_ID=

COGNITO_CLIENT_ID=

SNS_TOPIC_ARN=
```

---

# ▶️ Running the Project

## Frontend

```
npm run dev
```

Runs on

```
http://localhost:5173
```

---

## Backend

```
cd server

npm run dev
```

Runs on

```
http://localhost:5000
```

---

# 🏗 Architecture

```
               React Frontend
                      │
                      ▼
             Express REST API
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
 MongoDB Atlas              AWS Services
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
 Amazon Cognito          AWS Cost Explorer         Amazon SNS
                                 │
                                 ▼
                          CloudWatch (Future)
```

---

# 📌 API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

## Budget

```
GET /api/budget
POST /api/budget
PUT /api/budget
```

---

## AWS Cost

```
GET /api/cost
```

---

## SNS

```
POST /api/sns/send-alert
```

---

# 📚 Learning Objectives

This project was built to learn:

- MERN Stack Development
- REST API Design
- MongoDB Atlas
- Backend Architecture
- AWS SDK v3
- Amazon Cognito
- Amazon SNS
- AWS Cost Explorer
- CloudWatch Monitoring
- Secure Authentication
- Cloud Deployment

---

# 🚧 Project Status

- ✅ Frontend Completed
- ✅ Express Backend Created
- ✅ MongoDB Atlas Connected
- ⏳ Amazon Cognito Integration
- ⏳ AWS Cost Explorer Integration
- ⏳ Amazon SNS Integration
- ⏳ CloudWatch Integration
- ⏳ Deployment

---

# 📈 Future Improvements

- Email Notifications
- Multi-user Dashboard
- Monthly Expense Reports
- Cost Forecasting
- Resource Usage Analytics
- Dark Mode
- Admin Dashboard

---

# 👩‍💻 Author

**Sharvari Ballal**

Electronics & Telecommunication Engineering Student

Learning MERN Stack and AWS Cloud Development.

---

## ⭐ If you like this project, consider giving it a star!