import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AppContainer from "./components/AppContainer";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./layouts/MainLayout";
import SettingsPage from "./pages/SettingsPage";
import { setNavigate } from "./lib/navigation";
import NotesPage from "./pages/NotesPage";
import Tiptap from "./pages/CreateNotePage";
import UpdateNotePage from "./pages/UpdateNotePage";

export const Home = () => {
  return <div>Home</div>;
};

function App() {
  const navigate = useNavigate();
  setNavigate(navigate);
  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/:noteId" element={<UpdateNotePage />} />
          <Route path="tiptap" element={<Tiptap />} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:code" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
