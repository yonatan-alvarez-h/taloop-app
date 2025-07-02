import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [search, setSearch] = React.useState("");
  return (
    <BrowserRouter>
      <AppRoutes search={search} onSearch={setSearch} />
    </BrowserRouter>
  );
}

export default App;
