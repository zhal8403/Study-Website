import {
    FaHome,
    FaCalendarAlt,
    FaChalkboardTeacher,
    FaEnvelope,
    FaStickyNote,
    FaFolderOpen,
    FaRobot,
    FaChartBar,
    FaCog,
} from "react-icons/fa";

import "./Sidebar.css"

const items = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
    { id: "classroom", label: "Classroom", icon: <FaChalkboardTeacher /> },
    { id: "gmail", label: "Gmail", icon: <FaEnvelope /> },
    { id: "notes", label: "Notes", icon: <FaStickyNote /> },
    { id: "drive", label: "Drive", icon: <FaFolderOpen /> },
    { id: "ai", label: "AI Planner", icon: <FaRobot /> },
    { id: "analytics", label: "Analytics", icon: <FaChartBar /> },
];

export default function Sidebar({ page, setPage, user, }) {

    return(

        <aside className="sidebar">
            <div className="logo">
                <h1>StudyOS</h1>
                <p>Student Command Center</p>
            </div>

            <nav>
                {items.map((item)=>(
                    <button
                        key={item.id}
                        className={page === item.id ? "active" : ""}
                        onClick={() => setPage(item.id)}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="bottom">
                {user && (
                <div className="profile">
                    <img
                    src={user.picture}
                    alt=""
                    />

                    <div>
                    <strong>{user.given_name}</strong>
                    <p>{user.email}</p>
                    </div>
                </div>
                )}

                <button
                className={page === "settings" ? "active" : ""}
                onClick={() => setPage("settings")}
                >
                <FaCog />
                Settings
                </button>
            </div>
        </aside>

    )

}