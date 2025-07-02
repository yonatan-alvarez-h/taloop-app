import BurgerMenu from "./components/menu/BurgerMenu";
import SearchBar from "./components/search/SearchBar";

function App() {
  const handleSearch = (query: string) => {
    // Aquí puedes manejar la búsqueda de contenido
    alert(`Buscando: ${query}`);
  };
  return (
    <div>
      <nav className="navbar navbar-light bg-light px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <BurgerMenu />
          <span className="navbar-brand mb-0 h1 ms-2">taloop</span>
        </div>
        <div style={{ width: "300px" }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </nav>
    </div>
  );
}

export default App;
