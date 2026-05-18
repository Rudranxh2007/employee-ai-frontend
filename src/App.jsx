import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    skills: "",
    performanceScore: "",
    experience: ""
  });

  const [authData, setAuthData] = useState({
    email: "",
    password: ""
  });

  const [aiResponse, setAiResponse] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);



  // FETCH EMPLOYEES
  const fetchEmployees = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/employees"
    );

    setEmployees(res.data);

  };



  useEffect(() => {

    fetchEmployees();

    const token =
      localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

  }, []);




  // INPUT CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };



  // AUTH INPUT CHANGE
  const handleAuthChange = (e) => {

    setAuthData({

      ...authData,

      [e.target.name]:
      e.target.value

    });

  };




  // ADD OR UPDATE EMPLOYEE
  const handleSubmit = async (e) => {

    e.preventDefault();

    const payload = {

      ...formData,

      skills:
      formData.skills.split(",")

    };



    // UPDATE
    if (editingId) {

      await axios.put(

        `http://localhost:5000/api/employees/${editingId}`,

        payload

      );

      alert("Employee Updated");

      setEditingId(null);

    }

    // ADD
    else {

      await axios.post(

        "http://localhost:5000/api/employees",

        payload

      );

      alert("Employee Added");

    }

    setFormData({
      name: "",
      email: "",
      department: "",
      skills: "",
      performanceScore: "",
      experience: ""
    });

    fetchEmployees();

  };




  // DELETE EMPLOYEE
  const deleteEmployee =
    async (id) => {

    await axios.delete(

      `http://localhost:5000/api/employees/${id}`

    );

    alert("Employee Deleted");

    fetchEmployees();

  };




  // EDIT EMPLOYEE
  const editEmployee = (emp) => {

    setEditingId(emp._id);

    setFormData({

      name: emp.name,

      email: emp.email,

      department: emp.department,

      skills: emp.skills.join(","),

      performanceScore:
      emp.performanceScore,

      experience:
      emp.experience

    });

  };




  // SIGNUP
  const signup = async () => {

    try {

      const res = await axios.post(

        "http://localhost:5000/api/auth/signup",

        authData

      );

      alert(res.data.message);

    } catch (error) {

      alert(error.response.data.message);

    }

  };




  // LOGIN
  const login = async () => {

    try {

      const res = await axios.post(

        "http://localhost:5000/api/auth/login",

        authData

      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      setIsLoggedIn(true);

      alert("Login Successful");

    } catch (error) {

      alert(error.response.data.message);

    }

  };




  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    setIsLoggedIn(false);

    alert("Logged Out");

  };




  // AI RECOMMENDATION
  const getAIRecommendation =
    async (employee) => {

    const res = await axios.post(

      "http://localhost:5000/api/ai/recommend",

      employee

    );

    setAiResponse(
      res.data.recommendation
    );

  };




  return (

    <div className="container mt-4">

      <h1 className="mb-4">
        Employee AI System
      </h1>



      {/* AUTH */}

      <div className="card p-3 mb-4">

        <h3>
          HR/Admin Login
        </h3>

        <input
          className="form-control mb-2"
          placeholder="Email"
          name="email"
          onChange={handleAuthChange}
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleAuthChange}
        />

        <div className="d-flex gap-2">

          <button
            className="btn btn-dark"
            onClick={signup}
          >
            Signup
          </button>

          <button
            className="btn btn-success"
            onClick={login}
          >
            Login
          </button>

          <button
            className="btn btn-danger"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>




      {/* ONLY SHOW AFTER LOGIN */}

      {

        isLoggedIn && (

          <>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="card p-3 mb-4"
            >

              <h3>
                {
                  editingId
                  ? "Update Employee"
                  : "Add Employee"
                }
              </h3>

              <input
                className="form-control mb-2"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                placeholder="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                placeholder="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                placeholder="Performance Score"
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                placeholder="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />

              <button className="btn btn-primary">

                {
                  editingId
                  ? "Update Employee"
                  : "Add Employee"
                }

              </button>

            </form>




            {/* EMPLOYEE LIST */}

            <h2 className="mb-3">
              Employee List
            </h2>

            {

              employees.map((emp) => (

                <div
                  key={emp._id}
                  className="card p-3 mb-3"
                >

                  <h5>{emp.name}</h5>

                  <p>
                    Department:
                    {emp.department}
                  </p>

                  <p>
                    Score:
                    {emp.performanceScore}
                  </p>

                  <div className="d-flex gap-2">

                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        editEmployee(emp)
                      }
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteEmployee(emp._id)
                      }
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        getAIRecommendation(emp)
                      }
                    >
                      AI Recommendation
                    </button>

                  </div>

                </div>

              ))

            }




            {/* AI OUTPUT */}

            {

              aiResponse && (

                <div className="alert alert-info mt-4">

                  <h4>
                    AI Recommendation
                  </h4>

                  <p>{aiResponse}</p>

                </div>

              )

            }

          </>

        )

      }

    </div>

  );

}

export default App;