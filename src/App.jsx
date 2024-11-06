import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ListingPage from "./pages/ListingPage/ListingPage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import Header from "./components/Header/Header.jsx";
import PasswordPage from "./pages/PasswordPage/PasswordPage.jsx"


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/password" element={<PasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
