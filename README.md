# 🚀 Ecme Admin Panel

**Ecme** is a modern and responsive admin dashboard template built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It is designed to work seamlessly with a separate **Laravel REST API backend** and supports **multi-role authentication** out of the box.

---

## 📦 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API / Zustand (if used)
- **API**: Axios
- **Authentication**: Token-based (JWT / Sanctum)
- **Backend**: Laravel (in separate project)

---

## ✨ Features

- 🔐 Multi-role authentication (Admin, Manager, User, etc.)
- 🌗 Dark/Light mode toggle
- 🌍 i18n & RTL support
- 🧩 Component-based architecture
- 🔗 API ready (connects to Laravel backend)
- ⚡ Fast builds with Vite
- 🧱 Tailwind-based UI components
- 📁 Clean and scalable project structure

---

## 🖥️ Live Demo & Docs

- 🔗 [Live Demo](https://ecme-react.themenate.net/)
- 📚 [Online Documentation](https://ecme-react.themenate.net/guide/documentation/introduction)

---

## 📁 Project Structure

ecme-admin/
├── public/
├── src/
│ ├── auth/ # Role-based auth logic
│ ├── components/ # UI components
│ ├── layouts/ # AppShells, Layouts
│ ├── locales/ # i18n translations
│ ├── pages/ # Screens
│ ├── routes/ # Protected & public routes
│ ├── services/ # Axios API layer
│ ├── store/ # Auth, UI state
│ └── utils/ # Helper functions
├── .env
├── vite.config.ts
└── README.md

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js >= 18.x
- NPM or Yarn
- Laravel backend API (running separately)

---

### 🔧 Installation

1. **Clone the repo**

```bash
git clone https://github.com/your-username/ecme-admin.git
cd ecme-admin
```

2. **Install dependencies**

```bash
npm install
# or
yarn
```

3. **Create a `.env` file**

```bash
cp .env.example .env
```

Update `VITE_API_BASE_URL` with your Laravel backend API URL:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication & Roles

This template supports multiple roles:

- **Admin** – Full access
- **Manager** – Limited access
- **User** – Basic access

Routes and menu items are dynamically loaded based on user roles.

```ts
// Example route protection
<Route element={<PrivateRoute allowedRoles={['admin']} />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

---

## 🔗 Backend API (Laravel)

> The backend API is a **separate Laravel project**. This frontend expects:

- **Login Endpoint**: `POST /api/v1/login`
- **User Info Endpoint**: `GET /api/v1/user`
- **Token-based Authentication**: JWT or Sanctum
- **Role included in response**

Example login response:

```json
{
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
    },
    "token": "your-access-token"
}
```

---

## 🌐 API Service (Axios)

All API calls are abstracted in `/src/services/` and use Axios with automatic token injection.

```ts
// axiosInstance.ts
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

## 🧪 Testing

Coming soon — ready for integration with:

- **Vitest** or **Jest** for unit testing
- **React Testing Library** for UI testing

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 🤝 Credits

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Laravel](https://laravel.com/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)

---
