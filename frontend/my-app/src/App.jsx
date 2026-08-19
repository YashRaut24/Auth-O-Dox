import { useState } from "react";
import "./App.css";
import Landing from "./components/Landing/Landing";
import UserPage from "./components/User/UserPage";
import AdminPage from "./components/Admin/AdminPage";

function App() {
  const [page, setPage] = useState("landing");

  if (page === "user") {
    return <UserPage onBack={() => setPage("landing")} />;
  }

  if (page === "admin") {
    return <AdminPage onBack={() => setPage("landing")} />;
  }

  return (
    <Landing
      onUser={() => setPage("user")}
      onAdmin={() => setPage("admin")}
    />
  );
}

export default App;