import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AppContainer from "./components/AppContainer";
import ProfilePage from "./pages/auth/ProfilePage";
import MainLayout from "./layouts/MainLayout";
import SettingsPage from "./pages/auth/SettingsPage";
import { setNavigate } from "./lib/navigation";
import NotesPage from "./pages/note/NotesPage";
import Tiptap from "./pages/note/CreateNotePage";
import UpdateNotePage from "./pages/note/UpdateNotePage";
import JournalPage from "./pages/journal/JournalPage";
import CreateEntryPage from "./pages/journal/CreateEntryPage";

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
          <Route path="create-note" element={<Tiptap />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="create-entry/:date" element={<CreateEntryPage />} />
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
