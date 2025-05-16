import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../Images/logo.jpeg";
import { useAuthContext } from "../utils/authContext";

// Animated gradient background container
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #1e3c72, #2a5298, #6b7280);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

// Glassmorphism-inspired form container
const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 500px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Logo = styled.img`
  width: 70%; /* Increased from 120px */
  height: 120px;
  margin: 0 auto;
  display: block;
`;

const Title = styled.h2`
  font-family: "Cinzel", serif;
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #ffffff;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: center;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  /* Remove number input spinners */
  &[type="number"] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  /* Style for readOnly input */
  &[readOnly] {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #4caf50, #66bb6a);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  width: 100%;
  font-size: 1rem;

  &:hover {
    background: linear-gradient(45deg, #45a049, #5cb860);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
  }
`;

const ErrorMessage = styled.div`
  color: #ef5350;
  font-size: 1rem;
  text-align: center;
  margin-top: 20px;
`;

const RegisterPatient = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const [errorMessages, setErrorMessages] = useState(null);

  const [signUpUserDetails, setSignUpUserDetails] = useState({
    fullName: "",
    email: "",
    bloodgroup: "",
    gender: "",
    age: "",
    number: "",
    password: "",
    doctorId: "",
  });

  React.useEffect(() => {
    const doctorId = localStorage.getItem("doctorId") || "";
    setSignUpUserDetails((prev) => ({ ...prev, doctorId }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignUpUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const doctorId = localStorage.getItem("doctorId") || "";
      const payload = { ...signUpUserDetails, doctorId };
      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        payload,
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessages(
          error.response.data.message ||
          "An error occurred during registration."
        );
      }
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Logo src={logo} alt="Your Company" />
        <Title>Register Patient</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={signUpUserDetails.fullName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Id</Label>
            <Input
              id="email"
              name="email"
              type="text"
              value={signUpUserDetails.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bloodgroup">Blood Group</Label>
            <Input
              id="bloodgroup"
              name="bloodgroup"
              type="text"
              value={signUpUserDetails.bloodgroup}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              name="gender"
              type="text"
              value={signUpUserDetails.gender}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="number">Number</Label>
            <Input
              id="number"
              name="number"
              type="number"
              value={signUpUserDetails.number}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={signUpUserDetails.age}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={signUpUserDetails.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="doctorId">Doctor ID</Label>
            <Input
              id="doctorId"
              name="doctorId"
              type="text"
              value={signUpUserDetails.doctorId}
              readOnly
              required
            />
          </FormGroup>
          <SubmitButton type="submit">Register</SubmitButton>
        </form>
        {errorMessages && <ErrorMessage>{errorMessages}</ErrorMessage>}
      </FormContainer>
    </PageContainer>
  );
};

export default RegisterPatient;