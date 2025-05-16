import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../Images/logo.jpeg";
import { useAuthContext } from "../utils/authContext";

// Glassmorphism navbar
const NavbarContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.img`
  width: 200px; /* Increased from 80px */
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: linear-gradient(45deg, #008cba, #4fc3f7);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 140, 186, 0.4);
  margin-right: 20px;

  &:hover {
    background: linear-gradient(45deg, #007bb5, #29b6f6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 140, 186, 0.6);
  }
`;

const UserName = styled.p`
margin-left: -35em;
margin-right: 38em;
  color: #ffffff;
  font-size: 1.5rem;
  font-family: "Cinzel", serif;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Navbar = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <NavbarContainer>
      <Logo src={logo} alt="Logo" />
      <NavContent>
        <UserName>{authUser.fullName}</UserName>
        <BackButton onClick={handleBack}>Back</BackButton>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;