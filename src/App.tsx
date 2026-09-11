import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { InvitationsProvider } from "./context/InvitationsProvider";
import { FavoritesProvider } from "./context/FavoritesProvider";

function App() {
  const [search, setSearch] = React.useState("");
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <InvitationsProvider>
            <AppRoutes search={search} onSearch={setSearch} />
          </InvitationsProvider>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
