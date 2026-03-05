import React, { useState, useEffect } from 'react';
import '../styles/EmployeeManagement.css';

function EmployeeManagement({ apiUrl }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/employees/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError('Error creating employee: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`${apiUrl}/employees/${id}/`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete employee');
      fetchEmployees();
    } catch (err) {
      setError('Error deleting employee: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading employees...</div>;

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      {error && <div className="error-message">{error}</div>}

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Employee'}
      </button>

      {showForm && (
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee ID *</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Create Employee</button>
        </form>
      )}

      <div className="employees-list">
        {employees.length === 0 ? (
          <p className="empty-state">No employees found.</p>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployeeManagement;
