import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled table with glassmorphism and increased width
const Table = styled.table`
  width: 100%;
  max-width: 1400px; /* Increased table width */
  margin: 0 auto; /* Center the table */
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    border: none;
    padding: 16px; /* Increased padding for larger appearance */
    color: #ffffff;
    text-align: center;
    font-size: 1.2rem; /* Increased font size for table content */
  }

  th {
    background: rgba(255, 255, 255, 0.2);
    font-family: "Cinzel", serif;
    font-weight: 700;
    font-size: 1.3rem; /* Slightly larger font for headers */
  }

  td {
    background: rgba(255, 255, 255, 0.05);
  }
`;

// Header styling
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px; /* Slightly increased margin */
`;

const Title = styled.h1`
  font-family: "Cinzel", serif;
  color: #ffffff;
  font-size: 3rem; /* Increased font size for title */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// Styled buttons with gradient and increased font size
const Button = styled.button`
  background: linear-gradient(45deg, #4caf50, #66bb6a);
  color: white;
  padding: 14px 28px; /* Increased padding */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 1.2rem; /* Increased font size */
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);

  &:hover {
    background: linear-gradient(45deg, #45a049, #5cb860);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }
`;

const DeleteButton = styled(Button)`
  background: linear-gradient(45deg, #d32f2f, #ef5350);

  &:hover {
    background: linear-gradient(45deg, #c62828, #e53935);
    box-shadow: 0 6px 20px rgba(211, 47, 47, 0.6);
  }
`;

const ErrorText = styled.div`
  color: #ef5350;
  font-size: 1.2rem; /* Increased font size */
  text-align: center;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.2rem; /* Increased font size */
  text-align: center;
  margin-bottom: 20px;
`;

const NoPatientsText = styled.p`
  color: #ffffff;
  font-size: 1.2rem; /* Increased font size */
  text-align: center;
  margin-top: 20px;
`;

const List = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          navigate("/");
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/api/auth/allPatients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const patientsData = response.data.data || [];
        setAllPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patients:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError("Failed to fetch patients. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

  const deletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/");
        return;
      }

      await axios.delete(
        `http://localhost:3001/api/auth/deletePatient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedPatients = allPatients.filter(
        (patient) => patient._id !== patientId
      );
      setAllPatients(updatedPatients);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setError("Failed to delete patient. Please try again.");
    }
  };

  const addNewPatient = () => {
    navigate("/registerPatient");
  };

  const handleClick = (id) => {
    console.log("Setting pid in localStorage:", id);
    localStorage.setItem("pid", id);
    const storedId = localStorage.getItem("pid");
    console.log("pid in localStorage:", storedId);

    if (storedId === id) {
      navigate(`/patient?id=${id}`);
    } else {
      console.error("Failed to set pid in localStorage");
    }
  };

  return (
    <div>
      <Header>
        <Title>Patients</Title>
        <Button onClick={addNewPatient}>Add New</Button>
      </Header>

      {loading && <LoadingText>Loading...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}

      {!loading && !error && (
        <Table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Mobile</th>
              <th>Age</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allPatients && allPatients.length > 0 ? (
              allPatients
                .filter((member) => member != null)
                .map((member) => (
                  <tr key={member._id}>
                    <td>{member._id}</td>
                    <td>{member.fullName}</td>
                    <td>{member.number}</td>
                    <td>{member.age}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faUserPen}
                        className="cursor-pointer hover:scale-110 transition-transform duration-300"
                        style={{ fontSize: "1.4rem" }} /* Increased icon size */
                        onClick={() => handleClick(member._id)}
                      />
                    </td>
                    <td>
                      <DeleteButton onClick={() => deletePatient(member._id)}>
                        Delete
                      </DeleteButton>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6">
                  <NoPatientsText>No patients found</NoPatientsText>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default List;