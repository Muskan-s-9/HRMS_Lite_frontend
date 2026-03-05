import React, { useState } from 'react';
import './App.css';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [apiUrl] = useState(
    process.env.REACT_APP_API_URL || 'https://hrms-lite-backend.onrender.com/apii'
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>HRMS Lite</h1>
        <p>Human Resource Management System</p>
      </header>

      <nav className="App-nav">
        <button
          className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employee Management
        </button>
        <button
          className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance Management
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'employees' && <EmployeeManagement apiUrl={apiUrl} />}
        {activeTab === 'attendance' && <AttendanceManagement apiUrl={apiUrl} />}
      </main>
    </div>
  );
}

export default App;
