
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, UserPlus, Users, GraduationCap,
  Search, Trash2, Menu, X, BookOpen, CheckCircle,
  AlertCircle, LogOut
} from "lucide-react";
import "./App.css";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const courses = [
    "ReactJS",
    "Python",
    "Java",
    "Web Development",
    "Data Science"
  ];

  const validate = () => {
    let e = {};

    if (!form.name.trim())
      e.name = "Full name is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";

    if (!/^[0-9]{10}$/.test(form.mobile))
      e.mobile = "Enter a valid 10-digit mobile number";

    if (!form.course)
      e.course = "Please select a course";

    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (students.some(
      s => s.email.toLowerCase() === form.email.trim().toLowerCase()
    ))
      e.email = "This email is already registered";

    return e;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setMessage("");

    if (Object.keys(validationErrors).length > 0) return;

    const newStudent = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile,
      course: form.course,
      date: new Date().toLocaleDateString()
    };

    setStudents(prev => [...prev, newStudent]);

    setForm({
      name: "",
      email: "",
      mobile: "",
      course: "",
      password: "",
      confirmPassword: ""
    });

    setErrors({});
    setMessage("Student registered successfully!");
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Registration", icon: UserPlus },
    { name: "Students", icon: Users }
  ];

  return (
    <div className="app">

      <aside className={`sidebar ${menuOpen ? "show" : ""}`}>
        <div className="brand">
          <GraduationCap size={32} />
          <span>EduManage</span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <p className="nav-label">MAIN MENU</p>

        {navItems.map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${page === item.name ? "active" : ""}`}
              onClick={() => {
                setPage(item.name);
                setMenuOpen(false);
                setMessage("");
              }}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <GraduationCap size={20} />
          <span>Student Management System</span>
        </div>
      </aside>

      <main className="main">

        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>

          <div>
            <h2>{page}</h2>
            <p>Welcome to your student management dashboard</p>
          </div>

          <div className="admin">
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        {page === "Dashboard" && (
          <section className="content">

            <div className="welcome">
              <div>
                <h1>Welcome Back, Admin! 👋</h1>
                <p>Manage student registrations from one place.</p>
              </div>
              <button onClick={() => setPage("Registration")}>
                <UserPlus size={17} /> Add Student
              </button>
            </div>

            <div className="stats">

              <div className="stat-card purple">
                <div className="stat-icon"><Users /></div>
                <p>Total Students</p>
                <h2>{students.length}</h2>
                <span>Registered students</span>
              </div>

              <div className="stat-card blue">
                <div className="stat-icon"><BookOpen /></div>
                <p>Available Courses</p>
                <h2>{courses.length}</h2>
                <span>Courses offered</span>
              </div>

              <div className="stat-card green">
                <div className="stat-icon"><CheckCircle /></div>
                <p>Registrations</p>
                <h2>{students.length}</h2>
                <span>Successful registrations</span>
              </div>

            </div>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent Students</h2>
                  <p>Latest registered students</p>
                </div>
                <button className="outline-btn" onClick={() => setPage("Students")}>
                  View All
                </button>
              </div>

              <StudentTable
                students={[...students].reverse().slice(0, 5)}
                onDelete={deleteStudent}
              />
            </div>

          </section>
        )}

        {page === "Registration" && (
          <section className="content">

            <div className="form-panel">
              <div className="form-heading">
                <div className="heading-icon"><UserPlus /></div>
                <div>
                  <h2>New Student Registration</h2>
                  <p>Enter student information below.</p>
                </div>
              </div>

              {message && (
                <div className="success-message">
                  <CheckCircle size={20} /> {message}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                <div className="form-grid">

                  <Field label="Full Name" name="name"
                    value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                    error={errors.name} placeholder="Enter full name" />

                  <Field label="Email Address" name="email"
                    value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                    error={errors.email} placeholder="example@gmail.com" />

                  <Field label="Mobile Number" name="mobile"
                    value={form.mobile} onChange={e => setForm({...form, mobile:e.target.value})}
                    error={errors.mobile} placeholder="10-digit mobile number" />

                  <div className="field">
                    <label>Course</label>
                    <select value={form.course}
                      onChange={e => setForm({...form, course:e.target.value})}>
                      <option value="">Select a course</option>
                      {courses.map(c => <option key={c}>{c}</option>)}
                    </select>
                    {errors.course && <small>{errors.course}</small>}
                  </div>

                  <Field label="Password" name="password" type="password"
                    value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                    error={errors.password} placeholder="Minimum 8 characters" />

                  <Field label="Confirm Password" name="confirmPassword" type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword:e.target.value})}
                    error={errors.confirmPassword} placeholder="Confirm password" />

                </div>

                <div className="form-actions">
                  <button type="button" className="reset-btn"
                    onClick={() => {
                      setForm({name:"",email:"",mobile:"",course:"",password:"",confirmPassword:""});
                      setErrors({});
                      setMessage("");
                    }}>
                    Reset Form
                  </button>

                  <button type="submit" className="submit-btn">
                    <UserPlus size={18} /> Register Student
                  </button>
                </div>

              </form>
            </div>

          </section>
        )}

        {page === "Students" && (
          <section className="content">

            <div className="panel">

              <div className="panel-heading">
                <div>
                  <h2>Student Records</h2>
                  <p>Manage all registered students</p>
                </div>
                <button className="add-btn" onClick={() => setPage("Registration")}>
                  <UserPlus size={17} /> Add Student
                </button>
              </div>

              <div className="search-box">
                <Search size={19} />
                <input
                  placeholder="Search by name, email or course..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <StudentTable
                students={[...filteredStudents].reverse()}
                onDelete={deleteStudent}
              />

            </div>
          </section>
        )}

        <footer>
          © 2026 EduManage | Student Management System | ReactJS Practical No. 3
        </footer>

      </main>
    </div>
  );
}

function Field({label, name, value, onChange, error, placeholder, type="text"}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type}
        value={value} onChange={onChange} placeholder={placeholder} />
      {error && <small><AlertCircle size={13} /> {error}</small>}
    </div>
  );
}

function StudentTable({students, onDelete}) {
  if (students.length === 0) {
    return <div className="empty">
      <Users size={40} />
      <h3>No students found</h3>
      <p>Register a student to see records here.</p>
    </div>;
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
          {students.map(s => (
            <tr key={s.id}>
              <td><strong>{s.name}</strong></td>
              <td>{s.email}</td>
              <td>{s.mobile}</td>
              <td><span className="course-tag">{s.course}</span></td>
              <td>{s.date}</td>
              <td>
                <button className="delete-btn"
                  onClick={() => onDelete(s.id)}
                  title="Delete student">
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
