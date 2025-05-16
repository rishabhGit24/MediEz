import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [chatOutput, setChatOutput] = useState("How can I assist you today?");
  const [chatInput, setChatInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token Sent:", token);
        const response = await axios.get(
          "http://localhost:3001/api/patient/recent-doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllDoctors(response.data.data);
      } catch (error) {
        console.error("Error fetching Doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleClick = (id) => {
    console.log("Setting Doctor ID in localStorage:", id);
    localStorage.setItem("doctorId", id);
    navigate(`/doctor?id=${id}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setChatOutput("");
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/auth/chat",
        { text: chatInput },
        { withCredentials: true }
      );
      setChatOutput(data.summary);
      setChatInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatChange = (event) => {
    setChatInput(event.target.value);
  };

  return (
    <div className="members-list-container text-black">
      <div className="main-content scrollable-table">
        <header className="header">
          <h1 className="text-5xl">Doctors</h1>
        </header>
        <table className="members-table">
          <thead>
            <tr className="text-center">
              <th className="tableThingy">Doctor ID</th>
              <th className="tableThingy">Doctor Name</th>
              <th className="tableThingy">Specialization</th>
              <th className="tableThingy">Experience (Years)</th>
              <th className="tableThingy">Edit/View</th>
            </tr>
          </thead>
          <tbody>
            {allDoctors && allDoctors.length > 0 ? (
              allDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor._id}</td>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faUserPen}
                      className="cursor-pointer"
                      onClick={() => handleClick(doctor._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No doctors found</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Chat Button and Modal */}
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          Chat With Us
        </button>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <input
              placeholder="Enter your concerns"
              className="output w-full rounded-md p-2 no-outline"
              onChange={handleChatChange}
              name="chat"
              value={chatInput}
            />
            <div className="m-2">{chatOutput}</div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn" onClick={handleSubmit}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default List;