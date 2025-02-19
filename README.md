# Full Stack NoteApp (WebSockets + Redis + MongoDB)

This is a **real-time to-do list app** built using **Node.js, WebSockets, Redis, and MongoDB**, with a **React.js frontend**. The app allows users to **add and delete tasks** dynamically, ensuring **instant updates** via WebSockets.

##  Features
- **Real-time task updates** using WebSockets (Socket.io)
- **Tasks stored in Redis**, with automatic migration to **MongoDB** after 50+ tasks
- **Fully responsive UI** based on **Figma design**
- **Optimized for small screens (Nest Hub, Mobile, Tablet)**
- **Smooth UI interactions** with Tailwind CSS

---

## **Setup & Installation**
### **[1️] Clone the repository**
```
git clone https://github.com/YOUR_USERNAME/fullstack-task.git
cd fullstack-task
```

### **[2] Install dependencies**
### Backend
```
cd backend
npm install
```

### Frontend
```
cd ../frontend
npm install
```

### **[3️] Configure environment variables**
Make sure to replace the MongoDB credentials with your actual details!

# **Run the Project**

### **[1️] Start the backend**

```
cd backend
npx ts-node src/server.ts
```
Backend should be running on http://localhost:5000

### **[2️] Start the frontend**

```
cd frontend
npm start
```
Frontend should open on http://localhost:3000

**Tech Stack**
Backend: Node.js, TypeScript, Express.js, WebSockets (Socket.io)
Database: Redis (for caching), MongoDB (for long-term storage)
Frontend: React.js (TypeScript), Tailwind CSS
Deployment: To be done on Vercel / Heroku
