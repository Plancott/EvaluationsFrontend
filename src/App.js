import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowProducts from './components/ShowProducts';
import ShowCategory from "./components/ShowCategory"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowProducts />} />
        <Route path="/categories" element={<ShowCategory />} /> {/* Nueva ruta */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
