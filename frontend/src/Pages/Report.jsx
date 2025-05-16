import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../Components/Navbar";
import logo from "../Images/logo.jpeg"; // Updated to match Navbar import

// Animated gradient background container
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #1e3c72, #2a5298, #6b7280);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  flex-direction: column;
  font-family: "Poppins", sans-serif;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Glassmorphism-inspired content container
const ContentContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Styled table with glassmorphism
const Table = styled.table`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    border: none;
    padding: 16px;
    color: #ffffff;
    text-align: center;
    font-size: 1.2rem;
  }

  th {
    background: rgba(255, 255, 255, 0.2);
    font-family: "Cinzel", serif;
    font-weight: 700;
    font-size: 1.3rem;
  }

  td {
    background: rgba(255, 255, 255, 0.05);
  }
`;

// Header styling
const Title = styled.h2`
  font-family: "Cinzel", serif;
  color: #ffffff;
  font-size: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Styled logo
const Logo = styled.img`
  width: 200px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

// Styled buttons with gradient
const Button = styled.button`
  background: linear-gradient(45deg, #4caf50, #66bb6a);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  margin: 10px;

  &:hover {
    background: linear-gradient(45deg, #45a049, #5cb860);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }
`;

// Loading text
const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
`;

const Report = () => {
  const navigate = useNavigate(); // Updated to useNavigate
  const [report, setReport] = useState();
  const [patientDetails, setPatientDetails] = useState();
  const data = localStorage.getItem("output");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("data");
        const response = await axios.post(
          "http://localhost:3001/api/auth/openai/getReport",
          { data },
          {
            withCredentials: true,
          }
        );
        setReport(response.data);
      } catch (error) {
        console.log(error);
      }
      localStorage.removeItem("output");
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const id = localStorage.getItem("pid");
        const response = await axios.get(
          `http://localhost:3001/api/auth/getPatient/${id}`
        );
        setPatientDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <PageContainer>
      <Navbar />
      <ContentContainer>
        {report ? (
          <div>
            <Title>
              Medical Report
              <Logo src={logo} alt="Logo" />
            </Title>
            <Table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Summary</td>
                  <td>{report.summary}</td>
                </tr>
                <tr>
                  <td>Prescription</td>
                  <td>{report.summary2}</td>
                </tr>
                {/* <tr>
                  <td>Hindi Translation</td>
                  <td>{report.hindiTranslatation}</td>
                </tr>
                <tr>
                  <td>Kannada Translation</td>
                  <td>{report.kannadaTranslation}</td>
                </tr> */}
              </tbody>
            </Table>
            <div className="flex justify-center mt-4">
              <Button onClick={() => window

                .print()}>
                Print Report
              </Button>
              <Button onClick={() => navigate("/home")}>
                Back to Home
              </Button>
            </div>
          </div>
        ) : (
          <LoadingText>Loading report...</LoadingText>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default Report;