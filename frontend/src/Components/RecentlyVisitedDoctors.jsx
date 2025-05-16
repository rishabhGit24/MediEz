import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../Components/Navbar";

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
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-family: "Cinzel", serif;
  color: #ffffff;
  font-size: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

  &:hover {
    background: linear-gradient(45deg, #45a049, #5cb860);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }

  &:disabled {
    background: linear-gradient(45deg, #cccccc, #999999);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const RetryButton = styled(Button)`
  background: linear-gradient(45deg, #d32f2f, #ef5350);

  &:hover {
    background: linear-gradient(45deg, #c62828, #e53935);
    box-shadow: 0 6px 20px rgba(211, 47, 47, 0.6);
  }
`;

// Modal styling
const ModalBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 600px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1.1rem;
  font-family: "Poppins", sans-serif;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border: 1px solid #4caf50;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ModalOutput = styled.div`
  margin: 20px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CloseButton = styled(Button)`
  background: linear-gradient(45deg, #6b7280, #9ca3af);

  &:hover {
    background: linear-gradient(45deg, #5b6370, #8b939f);
    box-shadow: 0 6px 20px rgba(107, 114, 128, 0.6);
  }
`;

const ErrorText = styled.div`
  color: #ef5350;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
`;

const NoDoctorsText = styled.p`
  color: #ffffff;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 20px;
`;

export default function RecentlyVisitedDoctors() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatOutput, setChatOutput] = useState("How can I assist you today?");
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    // Hardcode doctors data for presentation with timestamp
    useEffect(() => {
        setLoading(false); // Skip loading since we're hardcoding
        setError(null);
        const hardcodedDoctors = [
            {
                doctorId: "680e10b8b70cf69bfea9f92a",
                doctorName: "Dr. Rishabh",
                specialization: "Pediatrician",
                timestamp: "2025-04-28 14:30:00", // Hardcoded timestamp for presentation
            },
        ];
        setDoctors(hardcodedDoctors);
    }, []);

    // Chatbot submit handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!chatInput.trim()) {
            setChatOutput("Please enter your symptoms or concerns.");
            return;
        }

        setChatLoading(true);
        setChatOutput("Processing your request...");

        try {
            const { data } = await axios.post(
                "http://localhost:3001/api/auth/chat",
                { text: chatInput, language: "en" },
                { withCredentials: true }
            );
            setChatOutput(data.summary || "Response received successfully.");
            setChatInput("");
        } catch (error) {
            console.error("Chatbot error:", error);
            setChatOutput(
                error.response?.data?.message ||
                "Sorry, something went wrong. Please try again later."
            );
        } finally {
            setChatLoading(false);
        }
    };

    // Chatbot input handler
    const handleChatChange = (event) => {
        setChatInput(event.target.value);
    };

    // Retry fetching doctors (not needed for hardcoded data)
    const handleRetry = () => {
        // No action needed since data is hardcoded
    };

    // Navigate to doctor profile
    const handleDoctorClick = (doctorId) => {
        if (doctorId) {
            navigate(`/doctor/${doctorId}`);
        } else {
            console.log("Doctor ID missing, cannot navigate");
        }
    };

    return (
        <PageContainer>
            <Navbar />
            <ContentContainer>
                <Header>
                    <Title>Recently Visited Doctors</Title>
                    <Button
                        onClick={() => document.getElementById("chat_modal").showModal()}
                    >
                        Chat With Us
                    </Button>
                </Header>

                <dialog id="chat_modal" className="modal modal-bottom sm:modal-middle">
                    <ModalBox>
                        <h3 className="font-semibold text-lg mb-4 text-white">
                            Chat with Assistant
                        </h3>
                        <ModalInput
                            placeholder="Enter your symptoms"
                            onChange={handleChatChange}
                            value={chatInput}
                            disabled={chatLoading}
                        />
                        <ModalOutput>
                            {chatLoading ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                chatOutput
                            )}
                        </ModalOutput>
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleSubmit} disabled={chatLoading}>
                                Submit
                            </Button>
                            <CloseButton
                                type="button"
                                onClick={() => document.getElementById("chat_modal").close()}
                                disabled={chatLoading}
                            >
                                Close
                            </CloseButton>
                        </div>
                    </ModalBox>
                </dialog>

                {loading && <LoadingText>Loading...</LoadingText>}
                {error && (
                    <div>
                        <ErrorText>{error}</ErrorText>
                        <RetryButton onClick={handleRetry}>Retry</RetryButton>
                    </div>
                )}

                {!loading && !error && (
                    <Table>
                        <thead>
                            <tr>
                                <th>Doctor ID</th>
                                <th>Doctor Name</th>
                                <th>Specialization</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!doctors || doctors.length === 0 ? (
                                <tr>
                                    <td colSpan="4">
                                        <NoDoctorsText>No doctors found</NoDoctorsText>
                                    </td>
                                </tr>
                            ) : (
                                doctors.map((doc, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-[rgba(255,255,255,0.1)] cursor-pointer"
                                        onClick={() => handleDoctorClick(doc.doctorId)}
                                    >
                                        <td>{doc.doctorId}</td>
                                        <td>{doc.doctorName}</td>
                                        <td>{doc.specialization}</td>
                                        <td>{doc.timestamp}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                )}
            </ContentContainer>
        </PageContainer>
    );
}