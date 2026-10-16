# Online Feedback System (MERN)

Students submit feedback for faculty; faculty view and search it by student name.
Stack: MongoDB · Express.js · React (Vite) · Node.js · JWT auth · Glassmorphism blue UI.

## Folder structure
```
online-feedback-system/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── models/                       # Student, Faculty, Feedback schemas
│   ├── controllers/                  # auth, faculty, feedback logic
│   ├── routes/                       # auth, faculty, feedback endpoints + validation
│   ├── middleware/                   # auth (JWT), validate, errorHandler
│   ├── postman/                      # Postman collection (all endpoints)
│   ├── seed.js                       # demo data
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js                # dev proxy: /api -> localhost:5000
    └── src/
        ├── main.jsx, App.jsx, api.js, index.css
        ├── context/AuthContext.jsx
        ├── components/               # Navbar, StarRating
        └── pages/                    # Login, StudentDashboard, FacultyDashboard
```

## Run it
1. Install Node 18+ and MongoDB (local) or create a free MongoDB Atlas cluster.
2. Backend
   ```
   cd backend
   npm install
   cp .env.example .env        # edit MONGO_URI / JWT_SECRET if needed
   npm run seed                # optional demo users + feedback
   npm run dev                 # http://localhost:5000
   ```
3. Frontend (new terminal)
   ```
   cd frontend
   npm install
   npm run dev                 # http://localhost:5173
   ```
4. Demo logins (after seeding): Student `S001 / student123`, Faculty `F001 / faculty123`.
5. Postman: import `backend/postman/Online-Feedback-System.postman_collection.json`.
   Run a Login request first; the token is saved automatically.

## API
| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| POST | /api/auth/student/register, /login | public | Student auth |
| POST | /api/auth/faculty/register, /login | public | Faculty auth |
| GET | /api/faculty | any logged in | Faculty list for dropdown |
| POST | /api/feedback | student | Create |
| GET | /api/feedback?student=name | faculty | Read all + search by student name |
| GET | /api/feedback/mine | student | Own feedback |
| GET | /api/feedback/:id | owner / faculty | Read one |
| PUT | /api/feedback/:id | owner student | Update |
| DELETE | /api/feedback/:id | owner student | Delete |

Final Project Complete...!