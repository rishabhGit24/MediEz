import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecentlyVisitedDoctors from "./RecentlyVisitedDoctors";

const PatientPortal = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, redirecting to login");
            navigate("/"); // Redirect to login page if no token
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("chat-user");
        navigate("/");
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Patient Portal</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
            <div className="grid gap-6">
                {/* Recently Visited Doctors Section */}
                <RecentlyVisitedDoctors />
                {/* Placeholder for Future Sections */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Upcoming Appointments
                    </h2>
                    <p className="text-gray-500">
                        Feature coming soon! Check back for your scheduled appointments.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;