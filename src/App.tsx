import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { InvitationsProvider } from "./context/InvitationsProvider";

function App() {
  const [search, setSearch] = React.useState("");
  return (
    <AuthProvider>
      <BrowserRouter>
        <InvitationsProvider>
          <AppRoutes search={search} onSearch={setSearch} />
        </InvitationsProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
