import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthContext } from "../utils/authContext";
import Modal from "./Modal";

// Global container with animated gradient background
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #1e3c72, #2a5298, #6b7280);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Poppins', sans-serif;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Glassmorphism-inspired form container
const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 600px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;

  label {
    width: 50%;
    margin-bottom: 12px;
    color: #ffffff;
    font-size: 0.95rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    border: none;
    padding: 12px;
    color: #ffffff;
    text-align: center;
  }

  th {
    background: rgba(255, 255, 255, 0.2);
    font-family: 'Cinzel', serif;
    font-weight: 700;
  }

  td {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const AddMedicineButton = styled.button`
  background: linear-gradient(45deg, #4caf50, #66bb6a);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);

  &:hover {
    background: linear-gradient(45deg, #45a049, #5cb860);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }
`;

const Attachments = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;

  img {
    margin-right: 12px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    max-width: 100px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const Upload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 25px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
  }

  input {
    display: none;
  }

  p {
    margin: 0;
    color: #ffffff;
    font-size: 0.95rem;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(45deg, #008cba, #4fc3f7);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 140, 186, 0.4);

  &:hover {
    background: linear-gradient(45deg, #007bb5, #29b6f6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 140, 186, 0.6);
  }
`;

// Diagnosis section with glowing effect
const DiagnosisContainer = styled.div`
  background: linear-gradient(45deg, #2e7d32, #4caf50);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(46, 125, 50, 0.5);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 30px rgba(46, 125, 50, 0.7);
  }
`;

// Summary section styling
const ReportContainer = styled.div`
  margin-top: 30px;

  h1 {
    font-family: 'Cinzel', serif;
    color: #ffffff;
    font-size: 2rem;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
  }
`;

const SummaryItem = styled.div`
  background: linear-gradient(45deg, #2e7d32, #4caf50);
  margin: 10px 0;
  padding: 15px;
  border-radius: 10px;
  color: #ffffff;
  text-align: center;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4);
  transition: all 0.3s ease;
  font-size: 1rem;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(46, 125, 50, 0.6);
  }
`;

const MedicalRecordForm = () => {
  const location = useLocation();
  const pid = localStorage.getItem("pid");
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([
    {
      name: "Paracetamol",
      price: 1000,
      dosage: "1 - M/A/E",
      instruction: "After meal",
      quantity: 1,
      amount: 1000,
    },
    {
      name: "Amoxicillin",
      price: 2300,
      dosage: "2 - M/A/E",
      instruction: "After meal",
      quantity: 2,
      amount: 4600,
    },
    {
      name: "Ibuprofen",
      price: 5000,
      dosage: "3 - M/A/E",
      instruction: "Before meal",
      quantity: 3,
      amount: 15000,
    },
  ]);
  const [audio, setAudio] = useState(null);
  const [text, setText] = useState(null);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const storedAudio = localStorage.getItem("recordedAudio");
    if (storedAudio) {
      setAudio(storedAudio);
    }
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/auth/getSummary/${pid}`
        );
        setSummary(response.data.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchSummary();
  }, []);

  if (audio) {
    const stt = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/auth/openai/getText"
        );
        localStorage.setItem("output", data.text);
        setText(data.text);
        const res = await axios.post(
          "http://localhost:3001/api/auth/saveReport",
          {
            doctorId: authUser._id,
            patientId: pid,
            summary: data.text,
          },
          { withCredentials: true }
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    stt();
  }

  const [isModalOpen, setModalOpen] = useState(false);

  const handleSaveMedicine = (medicine) => {
    setMedicines([...medicines, medicine]);
    setModalOpen(false);
  };

  const handleClick = () => {
    navigate("/record/");
  };

  const handleSave = () => {
    navigate("/report", { data: text });
  };

  console.log(summary);

  return (
    <PageContainer>
      <FormContainer>
        <form className="flex flex-col justify-center">
          <FormGroup>
            <Label>Doctor</Label>
            <p className="text-3xl text-white font-bold" style={{ fontFamily: 'Cinzel', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              Dr. {authUser.fullName}
            </p>
          </FormGroup>
          <DiagnosisContainer>
            {audio ? (
              <div className="text-white text-lg">{text}</div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <span className="text-white text-lg mt-4 mb-2 font-semibold">Diagnosis</span>
                <FontAwesomeIcon
                  onClick={handleClick}
                  icon={faMicrophone}
                  className="size-12 pb-2 text-white mt-2 mb-4 hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
          </DiagnosisContainer>
          <SaveButton onClick={handleSave} className="self-center mt-4">
            Save
          </SaveButton>
          <ReportContainer className="report-container">
            <h1>Patient Summaries</h1>
            {summary.length > 0 ? (
              <div className="summ-list">
                {summary.map((summ, index) => (
                  <SummaryItem key={index} className="summary-item">
                    <div>{summ.summary}</div>
                  </SummaryItem>
                ))}
              </div>
            ) : (
              <p className="text-white text-center">No summaries available.</p>
            )}
          </ReportContainer>
        </form>
        {isModalOpen && (
          <Modal
            onSave={handleSaveMedicine}
            onClose={() => setModalOpen(false)}
          />
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default MedicalRecordForm;
