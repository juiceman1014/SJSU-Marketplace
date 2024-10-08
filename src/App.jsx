import {Routes, Route} from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage.jsx"
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx"
import LoginPage from "./pages/LoginPage/LoginPage.jsx"
import ListingPage from "./pages/ListingPage/ListingPage.jsx"
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';

function App() {

  return(
    <Routes>
      <Route path = "/" element = {<HomePage />} />
      <Route path = "/register" element = {<RegisterPage />} />
      <Route path = "/login" element = {<LoginPage />} />
      <Route path = "/listing" element = {<ListingPage />} />
      <Route path = "/profile" element = {<ProfilePage />} />
    </Routes>
  )

}

export default App
