import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(false);

    // State for new employee form
    const [newEmployee, setNewEmployee] = useState({
      name: '',
      phone: '',
      isAdmin: false
    });

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      const response = await fetch('http://localhost:3000/employees');
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    }
    fetchEmployees();
  }
  , []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send POST request to add a new employee
      const response = await fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
      });
      const createdEmployee = await response.json();
      // Update local state with the newly created employee
      setEmployees([...employees, createdEmployee]);
      // Clear the form
      setNewEmployee({ name: '', phone: '', isAdmin: false });
    } catch (err) {
      console.error(err);
    }
  };

  // Update form fields
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Acme HR Portal</h1>
      <h2>Headcount: {employees.length ?? 0} Employees</h2>

       {/* Form to add a new employee */}
       <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input 
            id="name"
            name="name"
            type="text"
            value={newEmployee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input 
            id="phone"
            name="phone"
            type="text"
            value={newEmployee.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="isAdmin">
            <input 
              id="isAdmin"
              name="isAdmin"
              type="checkbox"
              checked={newEmployee.isAdmin}
              onChange={handleChange}
            />
            Admin
          </label>
        </div>
        <button type="submit">Add Employee</button>
      </form>

      <div>
        {employees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <h3>Name: {employee.name}</h3>
            <p>Contact: {employee.phone}</p>
            {employee.isAdmin && <p>Admin</p>}
          </div>
        ))}
      </div>

    </>
  )
}

export default App
