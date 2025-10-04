# 🧩 CRM System (Next.js )

A **Customer Relationship Management (CRM)** system built with **Next.js (frontend)**  
This project allows office users to manage **customers, jobs, appointments, invoices, and payments**, while technicians can view and manage their assigned jobs.

---

## 🌐 Project Overview

This full-stack application demonstrates an **enterprise-grade CRM** workflow:

- 🧑‍💼 Office users create and schedule jobs for customers  
- 👷 Technicians get assigned to appointments  
- 📅 Appointments prevent scheduling overlaps  
- 💰 Invoices & payments are tracked per job  
- 🔐 Secure login via Google, Facebook, Apple, and LinkedIn  

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **React Query**
- **React Hook Form + Zod**
- **Lucide Icons**


---

## 📂 Project Structure

```
crm/
├── frontend/               # Next.js App (App Router)
│   ├── app/                # Pages and layouts
│   ├── components/         # Reusable UI components
│   ├── lib/                # Axios & utility functions
│   └── ...
│
└── README.md
```

---

## ⚙️ Environment Setup

### 🧩 Prerequisites
- Node.js ≥ 20  
- npm ≥ 9 or yarn  

---

## 🖥️ Frontend Setup (Next.js + TypeScript)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up .env.local**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:7000/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Runs on [http://localhost:3000](http://localhost:3000)

---

## 🧩 Frontend Features
- 💼 Job and customer management  
- 💰 Invoice and payment visualization  
- ⚡ Real-time data   
  

---

## 🧠 Testing (Frontend)
```bash
npm run test
```

Includes:
- Component render tests  
- Form validation tests  
- API mock tests  

---

## 📦 Deployment

### 🧩 Frontend (Next.js)
Deploy easily with:
- **Vercel**



Ensure `.env` variables are properly configured in production.

---

## 🧾 API Endpoints (Sample)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/customers` | Fetch all customers |
| `POST` | `/api/jobs` | Create a job |
| `GET` | `/api/appointments` | List appointments |
| `POST` | `/api/appointments` | Create appointment (conflict check) |
| `GET` | `/api/invoices/:id` | Get invoice details |

---


## 👨‍💻 Author

**Adinlewa Tayo Michael**  
