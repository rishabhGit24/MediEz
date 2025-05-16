import React from "react";
import { ReactMic } from "react-mic";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AudioTimer from "../Components/AudioTimer";

// Animated gradient background container
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #1e3c72, #2a5298, #6b7280);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  display: flex;
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

// Glassmorphism-inspired recorder container
const RecorderContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  font-family: "Cinzel", serif;
  color: #ffffff;
  font-size: 1.8rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
`;

const SoundWave = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #008cba, #4fc3f7);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 140, 186, 0.4);
  margin: 5px;

  &:hover {
    background: linear-gradient(45deg, #007bb5, #29b6f6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 140, 186, 0.6);
  }
`;

const ClearButton = styled(Button)`
  background: linear-gradient(45deg, #d32f2f, #ef5350);

  &:hover {
    background: linear-gradient(45deg, #c62828, #e53935);
    box-shadow: 0 6px 20px rgba(211, 47, 47, 0.6);
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: 20px;
`;

const Recorder = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [voice, setVoice] = React.useState(false);
  const [recordBlobLink, setRecordBlobLink] = React.useState(null);

  const onStop = (recordedBlob) => {
    setRecordBlobLink(recordedBlob.blobURL);
    setIsRunning(false);
    localStorage.setItem("recordedAudio", recordedBlob.blobURL);
    fetch(recordedBlob.blobURL)
      .then((res) => res.blob())
      .then((blob) => {
        handler(blob);
      });

    function handler(inputBlob) {
      const url = URL.createObjectURL(inputBlob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "audio.webm");
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const startHandle = () => {
    setElapsedTime(0);
    setIsRunning(true);
    setVoice(true);
  };

  const stopHandle = () => {
    setIsRunning(false);
    setVoice(false);
  };

  const clearHandle = () => {
    setIsRunning(false);
    setVoice(false);
    setRecordBlobLink(false);
    setElapsedTime(0);
  };

  const handleClick = () => {
    navigate("/patient");
  };

  return (
    <PageContainer>
      <RecorderContainer>
        <Title>Audio Recorder</Title>
        <AudioTimer
          isRunning={isRunning}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
        />
        <SoundWave>
          <ReactMic
            record={voice}
            className="sound-wave w-full"
            onStop={onStop}
            strokeColor="#ffffff"
          />
        </SoundWave>
        <div>
          {recordBlobLink && (
            <ClearButton onClick={clearHandle}>Clear</ClearButton>
          )}
          {!voice ? (
            <Button onClick={startHandle}>Start</Button>
          ) : (
            <Button onClick={stopHandle}>Stop</Button>
          )}
          <Button onClick={handleClick}>Finish Recording</Button>
        </div>
        {recordBlobLink && <AudioPlayer controls src={recordBlobLink} />}
      </RecorderContainer>
    </PageContainer>
  );
};

export default Recorder;