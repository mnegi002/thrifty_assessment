# Assessment Tasks

This repository contains three tasks demonstrating different functionalities using Node.js, Express, MongoDB, and React and one DSA using Python.

---

## **Task 2: Real-time Chat Application with Sentiment Analysis**

### **Description**
A chat application with sentiment analysis. It has two folders:
- **backend** (Node.js + Express + WebSocket)
- **frontend** (React)

Messages sent between users are analyzed for sentiment (positive, neutral, negative).

### **How to Run**
1. Clone the repository and navigate to the project folder.
2. Go to the **backend** folder:
   ```bash
   cd backend
   npm install
   npm run dev
3. Go to the **frontend** folder:
   ```bash
   cd frontend
   npm install
   npm run dev
4. Open two tabs with **localhost:5173**
5. You will be able to see the live chat updates.

## **Task 3: Data Processing API**


## **Description**
This task implements a **Node.js + Express** backend API that:
It has three main API endpoints:
1. **POST** `/activity` - Add a new activity  
2. **GET** `/activity/:userId` - Get all activities for a specific user  
3. **GET** `/activity/:userId/summary` - Get activity summary for a user  



## **1. POST `/activity`**

### **Description**
Adds a new activity for a user.

### **Thunder Client / Postman Setup**
- **Method:** `POST`
- **URL:** `http://localhost:3000/activity`
- **Headers:**  
**JSON**
{
  "userId": "mayank",
  "action": "login"
}

## **2. GET `/activity/:userId`**
### **Thunder Client / Postman Setup**
- **Method:** `GET`
- **URL:** `http://localhost:3000/activity/mayank`

## **2. GET `/activity/:userId`**
### **Thunder Client / Postman Setup**
- **Method:** `GET`
- **URL:** `http://localhost:3000/activity/mayank/summary`

**PS : for simplicity everything is in server.js file. env file for connection string , routes, controllers and utils can be maintained accordingly in separate file and folders**
