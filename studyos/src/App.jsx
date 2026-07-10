import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Gmail from "./pages/Gmail";
import Drive from "./pages/Drive";
import Classroom from "./pages/Classroom";
import AI from "./pages/AI";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import Login from "./pages/login";

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);

  if (!user) 
  {
    return <Login setUser={setUser} setToken={setToken} />;
  }

  const renderPage = (token) => {
    switch (page) {
      case "calendar":
        return <Calendar token={token}/>;
      case "gmail":
        return <Gmail token={token}/>;
      case "drive":
        return <Drive token={token}/>;
      case "classroom":
        return <Classroom token={token}/>;
      case "ai":
        return <AI token={token}/>;
      case "analytics":
        return <Analytics token={token}/>;
      case "settings":
        return <Settings token={token}/>;
      default:
        return <Dashboard token={token} user={user}/>;
    }
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} user={user} />
      <div className="main">
        <Header user={user} />
        {renderPage(token)}
      </div>
    </div>
  );
}

export default App;