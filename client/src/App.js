import axios from "axios";
import React, { useState } from "react";
import alertify from "alertifyjs";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(Number);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(Number);
  const [primaryKey, setPrimaryKey] = useState(uuidv4());
  const [employeesList, setEmployeesList] = useState([]);
  const [isOpenEmployeeList, setIsOpenEmployeeList] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const resetState = () => {
    setName("");
    setAge("");
    setCountry("");
    setPosition("");
    setWage("");
    setPrimaryKey(uuidv4());
  };

  const showEmployees = async () => {
    if (isOpenEmployeeList) setIsOpenEmployeeList(false);
    else {
      await axios.get("http://localhost:3001/get").then((response) => {
        setEmployeesList(response.data);
        setIsOpenEmployeeList(true);
      });
    }
  };

  const createEmployee = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3001/create", {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage,
      primaryKey: primaryKey,
    });

    setEmployeesList([
      ...employeesList,
      {
        name,
        age,
        country,
        position,
        wage,
        primaryKey,
      },
    ]);

    alertify.success("Employee added to list.");
    resetState();
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`http://localhost:3001/${id}`);
    setEmployeesList([
      ...employeesList.filter((item) => item.primaryKey !== id),
    ]);
    alertify.error("Employee Deleted");
  };

  const updateEmployeePrepare = (employee) => {
    setIsUpdate(true);
    setName(employee.name);
    setAge(employee.age);
    setCountry(employee.country);
    setPosition(employee.position);
    setWage(employee.wage);
    setPrimaryKey(employee.primaryKey);
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    await axios.put("http://localhost:3001/update", {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage,
      primaryKey: primaryKey,
    });
    let employeeItemID = null;
    let findItem = employeesList.map((item, i) => {
      if (item.primaryKey !== primaryKey) return item;
      else employeeItemID = i;
    });
    let copyEmployeesList = [...employeesList];
    copyEmployeesList[employeeItemID] = {
      name,
      age,
      country,
      position,
      wage,
      primaryKey,
    };

    setEmployeesList(copyEmployeesList);

    alertify.warning("Employee's values changed.");

    resetState();
  };

  return (
    <div className="App container">
      <div className="information">
        <form action="" onSubmit={isUpdate ? updateEmployee : createEmployee}>
          <div className="input-group mt-2">
            <span className="input-group-text">Name</span>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group mt-2">
            <span className="input-group-text">Age</span>
            <input
              type="number"
              className="form-control"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="input-group mt-2">
            <span className="input-group-text">Country</span>
            <input
              type="text"
              className="form-control"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <div className="input-group mt-2">
            <span className="input-group-text">Position</span>
            <input
              type="text"
              className="form-control"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          <div className="input-group mt-2">
            <span className="input-group-text">Wage</span>
            <input
              type="number"
              className="form-control"
              placeholder="Wage"
              value={wage}
              onChange={(e) => setWage(e.target.value)}
              required
            />
          </div>

          <div className="input-group mt-2">
            <span className="input-group-text">Your Code</span>
            <input
              type="text"
              className="form-control"
              placeholder="Wage"
              value={primaryKey}
              disabled
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary mt-3">
              {isUpdate ? "Update Employee" : "Create Employee"}{" "}
            </button>
            <button
              type="button"
              className="btn btn-dark mt-3 ms-3"
              onClick={showEmployees}
            >
              {isOpenEmployeeList ? "Hide Employees" : "Show Employees"}
            </button>
          </div>
        </form>
      </div>
      <hr />
      {isOpenEmployeeList && employeesList.length ? (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Country</th>
              <th>Position</th>
              <th>Wage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employeesList.map((employeeItem, i) => (
              <tr key={employeeItem.primaryKey}>
                <td>{i}</td>
                <td>{employeeItem.name}</td>
                <td>{employeeItem.age}</td>
                <td>{employeeItem.country}</td>
                <td>{employeeItem.position}</td>
                <td>{employeeItem.wage}</td>
                <td>
                  <div className="btns">
                    <button
                      className="btn btn-warning btn-sm mt-1 ms-1"
                      onClick={() => updateEmployeePrepare(employeeItem)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm mt-1 ms-1"
                      onClick={() => deleteEmployee(employeeItem.primaryKey)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {isOpenEmployeeList ? null : "No Data Available"}
    </div>
  );
};

export default App;
