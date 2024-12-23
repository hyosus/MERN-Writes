import LeftSidebar from "./components/LeftSidebar";
import Overview from "./components/Overview";
import Topbar from "./components/Topbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotesPage from "./pages/NotesPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Topbar></Topbar>

        <div className="flex gap-4">
          <LeftSidebar></LeftSidebar>

          <Routes>
            <Route path="/" element={<Overview />}></Route>
            <Route path="/notes" element={<NotesPage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
