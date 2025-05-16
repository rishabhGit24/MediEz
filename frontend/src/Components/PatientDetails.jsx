import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PatientDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  line-height: 1.5;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #666;
    margin-bottom: 5px;
  }
`;

const PatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view patient details.");
          navigate("/login");
          return;
        }

        console.log("Location search:", location.search); // Debug the URL query
        const searchParams = new URLSearchParams(location.search);
        let id = searchParams.get("id");

        console.log("Extracted id from URL:", id); // Debug the extracted id

        // Fallback to localStorage if id is not in URL
        if (!id) {
          id = localStorage.getItem("pid");
          console.log("Falling back to localStorage pid:", id); // Debug the fallback
        }

        if (!id) {
          setError("Patient ID is missing in the URL and localStorage.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/auth/getPatient/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatientDetails(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching patients:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load patient details.");
        }
      }
    };

    fetchPatients();
  }, [location.search, navigate]);

  return (
    <PatientDetailsContainer>
      {patientDetails ? (
        <PatientInfo>
          <h3>{patientDetails.fullName}</h3>
          <p>Gender: {patientDetails.gender}</p>
          <p>Phone Number: {patientDetails.number}</p>
          <p>Age: {patientDetails.age}</p>
        </PatientInfo>
      ) : (
        <p>{error || "Loading patient details..."}</p>
      )}
    </PatientDetailsContainer>
  );
};

export default PatientDetails;