import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [search, setSearch] = React.useState("");
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes search={search} onSearch={setSearch} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
