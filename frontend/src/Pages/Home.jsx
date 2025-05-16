import styled from "styled-components";
import List from "../Components/List";
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

const Home = () => {
  return (
    <PageContainer>
      <Navbar />
      <ContentContainer>
        <List />
      </ContentContainer>
    </PageContainer>
  );
};

export default Home;