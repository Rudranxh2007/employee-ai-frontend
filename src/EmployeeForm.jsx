import { useState } from "react";
import axios from "axios";

function EmployeeForm() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    skills: "",
    performanceScore: "",
    experience: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      skills: formData.skills.split(",")
    };

    await axios.post(
      "https://employee-ai-backend-e4th.onrender.com/api/employees",
      payload
    );

    alert("Employee Added");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default EmployeeForm;