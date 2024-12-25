import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

export const Home = () => {
  return <div>Home</div>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
