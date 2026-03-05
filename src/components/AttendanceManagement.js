import React, { useState, useEffect } from 'react';
import '../styles/AttendanceManagement.css';

function AttendanceManagement({ apiUrl }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    status: 'present'
  });

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/employees/`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    if (employeeId) {
      fetchAttendance(employeeId);
    } else {
      setAttendanceRecords([]);
    }
  };

  const fetchAttendance = async (employeeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/employees/${employeeId}/attendance/`);
      if (!response.ok) throw new Error('Failed to fetch attendance');
      const data = await response.json();
      setAttendanceRecords(data.attendance_records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !formData.date || !formData.status) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/attendance/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: parseInt(selectedEmployee),
          date: formData.date,
          status: formData.status
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      setFormData({ employee: '', date: '', status: 'present' });
      fetchAttendance(selectedEmployee);
    } catch (err) {
      setError('Error marking attendance: ' + err.message);
    }
  };

  if (loading && !employees.length) return <div className="loading">Loading...</div>;

  return (
    <div className="attendance-management">
      <h2>Attendance Management</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="attendance-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Employee *</label>
          <select value={selectedEmployee || ''} onChange={handleEmployeeChange} required>
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Mark Attendance</button>
      </form>

      {selectedEmployee && (
        <div className="attendance-records">
          <h3>Attendance Records</h3>
          {attendanceRecords.length === 0 ? (
            <p className="empty-state">No attendance records found.</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, idx) => (
                  <tr key={idx} className={`status-${record.status}`}>
                    <td>{record.date}</td>
                    <td className="status-badge">{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendanceManagement;
