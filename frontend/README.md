# EduManage - Comprehensive Education Management System

A modern, AI-powered education management platform built with React, Vite, Tailwind CSS, and Firebase.

## 🚀 Features

### Super Admin Features
- **User Management**: Create, edit, and manage users (students, teachers, admins)
- **Academic Year Management**: Set up academic years with terms/semesters
- **Subject & Class Management**: Organize subjects and class structures
- **Timetable Builder**: AI-assisted scheduling with conflict detection
- **Analytics Dashboard**: Comprehensive insights and performance metrics
- **Communication Hub**: Send announcements and manage messaging
- **Report Generation**: Export detailed academic and administrative reports

### Teacher Features
- **Class Management**: View assigned classes and student rosters
- **Attendance Tracking**: Quick attendance marking with analytics
- **Grade Management**: Flexible grading system with progress tracking
- **Assignment Management**: Create, distribute, and grade assignments
- **Communication**: Message students and parents
- **Reports**: Generate class and student performance reports

### Student Features
- **Personal Dashboard**: Academic overview and progress tracking
- **Grade Tracking**: View grades, GPA, and performance analytics
- **Assignment Portal**: Submit assignments and track progress
- **Attendance Overview**: Monitor attendance patterns
- **Study Boards**: Collaborative learning with AI tutoring
- **Resource Library**: Access study materials and resources

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Charts**: Recharts (for analytics)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd edumanage
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `src/config/firebase.js`

4. Start the development server:
```bash
npm run dev
```

## 🔧 Firebase Configuration

Update `src/config/firebase.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── SuperAdmin/
│   │   ├── SuperAdminHome.jsx
│   │   ├── UserManagement.jsx
│   │   ├── AcademicYearManagement.jsx
│   │   └── ...
│   ├── Teacher/
│   │   ├── TeacherHome.jsx
│   │   ├── MyClasses.jsx
│   │   └── ...
│   └── Student/
│       ├── StudentHome.jsx
│       ├── StudentGrades.jsx
│       └── ...
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── Login.jsx
│   ├── SuperAdminDashboard.jsx
│   ├── TeacherDashboard.jsx
│   └── StudentDashboard.jsx
├── config/
│   └── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

## 👥 User Roles

### Super Admin
- Full system access and configuration
- User management and role assignment
- Academic structure setup
- System analytics and reporting

### Teacher
- Class and student management
- Attendance and grade tracking
- Assignment creation and grading
- Parent communication

### Student
- Academic progress tracking
- Assignment submission
- Study collaboration
- Resource access

## 🔐 Authentication

The system uses Firebase Authentication with role-based access control:
- Email/password authentication
- Role-based routing and permissions
- Secure user session management

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  role: 'super_admin' | 'teacher' | 'student',
  phone: string,
  address: string,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Academic Years Collection
```javascript
{
  name: string,
  description: string,
  startDate: date,
  endDate: date,
  isActive: boolean,
  terms: [{
    name: string,
    startDate: date,
    endDate: date
  }]
}
```

### Subjects Collection
```javascript
{
  name: string,
  code: string,
  description: string,
  credits: number,
  type: 'core' | 'elective' | 'optional',
  department: string
}
```

### Classes Collection
```javascript
{
  name: string,
  grade: number,
  section: string,
  capacity: number,
  room: string,
  classTeacher: string,
  subjects: [subjectId],
  academicYear: academicYearId
}
```

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔮 Future Enhancements

- AI-powered lesson plan generation
- Advanced analytics with machine learning
- Mobile application (React Native)
- Video conferencing integration
- Blockchain-based certificates
- IoT integration for smart classrooms

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using React, Firebase, and modern web technologies.
