# 🗺 Tour Booking App

This project is a full-stack web application for managing tours. It allows users to browse individual and group tours, register for tours, and view/manage their registrations. Built with **React**, **Express**, and **PostgreSQL**.

## 🚀 Features

### 👥 Users
- Sign up / Log in with JWT authentication
- View available individual or group tours
- Register for a tour
- View and manage their own registrations
- Leave reviews of the tours

### 👤Admin
- Create, edit, or delete tours
- View all user registrations
- Confirm registrations

### ⚙️ Additional Features
- Pagination for tours, reviews, registrations
- Role-based access (user/admin)
- Clean and minimal UI for ease of use
- Responsive design using **Tailwind CSS + DaisyUI**
- Search and sorting (optional/coming soon)


## 🛠️ Tech Stack

### Frontend
- [React](https://reactjs.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Postgres](https://www.npmjs.com/package/postgres)
- [JWT Authentication ( jsonwebtoken )](https://www.npmjs.com/package/jsonwebtoken)


## 🖥 Installation & Setup

### Environment Variables
There's a file `env-example` in both `backend` and `frontend` folders, which show everything you'll need for `.env`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Backend
```bash
cd backend
npm install
npm run start
```