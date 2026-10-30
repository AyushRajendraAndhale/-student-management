import React, { useState, useEffect } from "react";

import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  Search,
  Trash2,
  Menu,
  X,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Activity
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import "./App.css";

const COURSES = [
  "ReactJS",
  "Python",
  "Java",
  "Web Development",
  "Data Science"
];

const COLORS = [
  "#b31335",
  "#ed5275",
  "#f5a623",
  "#20a6a0",
  "#6654d9"
];

const EMPTY_FORM = {
  name: "",
  email: "",
  mobile: "",
  course: "",
  password: "",
  confirmPassword: ""
};

function App() {
  const [page, setPage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("students")) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // COURSE STATISTICS

  const courseData = COURSES.map(course => ({
    name: course,
    students: students.filter(
      student => student.course === course
    ).length
  }));

  const activeCourses = courseData.filter(
    course => course.students > 0
  ).length;

  // FORM VALIDATION

  const validateForm = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Full name is required";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(form.name.trim())) {
      e.name = "Enter a valid name";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address";
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      e.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!form.course) {
      e.course = "Please select a course";
    }

    if (form.password.length < 8) {
      e.password = "Password must contain 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      e.confirmPassword = "Passwords do not match";
    }

    if (
      students.some(
        student =>
          student.email.toLowerCase() ===
          form.email.trim().toLowerCase()
      )
    ) {
      e.email = "Email is already registered";
    }

    return e;
  };

  // INPUT HANDLING

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));

    setErrors(previous => ({
      ...previous,
      [name]: ""
    }));

    setMessage("");
  };

  // REGISTER STUDENT

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile,
      course: form.course,
      date: new Date().toLocaleDateString()
    };

    setStudents(previous => [...previous, newStudent]);
    setForm(EMPTY_FORM);
    setErrors({});
    setMessage("Student registered successfully!");
  };

  // RESET FORM

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setMessage("");
  };

  // DELETE STUDENT

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(previous =>
        previous.filter(student => student.id !== id)
      );
    }
  };

  // SEARCH STUDENTS

  const filteredStudents = students.filter(student => {
    const term = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.course.toLowerCase().includes(term) ||
      student.mobile.includes(term)
    );
  });

  // NAVIGATION

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Registration", icon: UserPlus },
    { name: "Students", icon: Users }
  ];

  // MAIN RETURN

  return (
    <div className="app">
      {/* PEACOCK BACKGROUND */}
      <div className="feather-background">
        <div className="feather feather-one">
          <div className="feather-eye"></div>
        </div>
        <div className="feather feather-two">
          <div className="feather-eye"></div>
        </div>
        <div className="feather feather-three">
          <div className="feather-eye"></div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={27} />
          </div>
          <span>
            Edu<span className="brand-light">Manage</span>
          </span>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-circle">A</div>
          <div>
            <strong>Administrator</strong>
            <small>Management Portal</small>
          </div>
        </div>

        <p className="nav-label">MAIN MENU</p>

        {navigation.map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                page === item.name ? "active" : ""
              }`}
              onClick={() => {
                setPage(item.name);
                setMenuOpen(false);
                setMessage("");
              }}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <Sparkles size={18} />
          <span>Powered by ReactJS</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>

          <div>
            <h2>{page}</h2>
            <p>Student Management System</p>
          </div>

          <div className="admin">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        {/* DASHBOARD PAGE */}
        {page === "Dashboard" && (
          <section className="content">
            <div className="welcome">
              <div>
                <span className="welcome-label">
                  <Sparkles size={14} />
                  WELCOME BACK
                </span>
                <h1>Hello, Administrator! 👋</h1>
                <p>
                  Manage your student registrations and academic activities.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setPage("Registration")}
              >
                <UserPlus size={18} />
                Add Student
              </button>
            </div>

            {/* STATISTICS CARDS */}
            <div className="stats">
              <StatCard
                icon={<Users />}
                title="Total Students"
                value={students.length}
                description="Registered students"
                color="red"
              />
              <StatCard
                icon={<BookOpen />}
                title="Available Courses"
                value={COURSES.length}
                description="Courses offered"
                color="blue"
              />
              <StatCard
                icon={<CheckCircle />}
                title="Registrations"
                value={students.length}
                description="Successful registrations"
                color="green"
              />
              <StatCard
                icon={<Activity />}
                title="Active Courses"
                value={activeCourses}
                description="Courses with students"
                color="gold"
              />
            </div>

            {/* GRAPHS */}
            <div className="charts">
              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Student Enrolment</h2>
                    <p>Course-wise student statistics</p>
                  </div>
                  <span className="chart-badge">Live Data</span>
                </div>

                <ResponsiveContainer width="100%" height={290}>
                  <BarChart data={courseData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-12}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="students"
                      name="Students"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1200}
                    >
                      {courseData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Course Distribution</h2>
                    <p>Students enrolled in each course</p>
                  </div>
                </div>

                {students.length > 0 ? (
                  <ResponsiveContainer width="100%" height={290}>
                    <PieChart>
                      <Pie
                        data={courseData.filter(
                          course => course.students > 0
                        )}
                        dataKey="students"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={95}
                        innerRadius={48}
                        paddingAngle={4}
                      >
                        {courseData
                          .filter(course => course.students > 0)
                          .map(entry => (
                            <Cell
                              key={entry.name}
                              fill={COLORS[COURSES.indexOf(entry.name)]}
                            />
                          ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty">
                    <Activity size={40} />
                    <h3>No course data yet</h3>
                    <p>Register students to see distribution.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* REGISTRATION PAGE */}
        {page === "Registration" && (
          <section className="content">
            <div className="form-panel">
              <div className="form-heading">
                <div className="heading-icon">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2>New Student Registration</h2>
                  <p>Enter student information below.</p>
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="success-message">
                  <CheckCircle size={20} />
                  {message}
                </div>
              )}

              {/* REGISTRATION FORM */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <Field
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Enter full name"
                  />
                  <Field
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="example@gmail.com"
                    type="email"
                  />
                  <Field
                    label="Mobile Number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    placeholder="10-digit mobile number"
                    type="tel"
                  />

                  {/* COURSE SELECTION */}
                  <div className="field">
                    <label htmlFor="course">Select Course</label>
                    <select
                      id="course"
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                    >
                      <option value="">Select a course</option>
                      {COURSES.map(course => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                    {errors.course && (
                      <small>
                        <AlertCircle size={13} />
                        {errors.course}
                      </small>
                    )}
                  </div>

                  <Field
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Minimum 8 characters"
                    type="password"
                  />
                  <Field
                    label="Confirm Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm password"
                    type="password"
                  />
                </div>

                {/* FORM BUTTONS */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={resetForm}
                  >
                    Reset Form
                  </button>
                  <button type="submit" className="primary-btn">
                    <UserPlus size={18} />
                    Register Student
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* STUDENT RECORDS PAGE */}
        {page === "Students" && (
          <section className="content">
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Student Records</h2>
                  <p>Manage all registered students</p>
                </div>
                <button
                  className="primary-btn"
                  onClick={() => setPage("Registration")}
                >
                  <UserPlus size={17} />
                  Add Student
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="search-box">
                <Search size={19} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
              </div>

              {/* STUDENT TABLE */}
              <StudentTable
                students={[...filteredStudents].reverse()}
                onDelete={deleteStudent}
              />
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer>
          <GraduationCap size={16} />
          EduManage © 2026 | ReactJS Student Management System
        </footer>
      </main>
    </div>
  );
}

// ------------------------------------
// STATISTICS CARD COMPONENT
// ------------------------------------

function StatCard({ icon, title, value, description, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </div>
  );
}

// ------------------------------------
// REUSABLE FORM FIELD COMPONENT
// ------------------------------------

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text"
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
      {error && (
        <small>
          <AlertCircle size={13} />
          {error}
        </small>
      )}
    </div>
  );
}

// ------------------------------------
// STUDENT TABLE COMPONENT
// ------------------------------------

function StudentTable({ students, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="empty">
        <Users size={42} />
        <h3>No students found</h3>
        <p>Register a student to see records here.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Course</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>
                <strong>{student.name}</strong>
              </td>
              <td>{student.email}</td>
              <td>{student.mobile}</td>
              <td>
                <span className="course-tag">{student.course}</span>
              </td>
              <td>{student.date}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(student.id)}
                  title="Delete student"
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;