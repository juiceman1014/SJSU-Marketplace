import {Routes, Route} from 'react-router-dom';
import HomePage from "./pages/HomePage/HomePage.jsx"
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx"
import LoginPage from "./pages/LoginPage/LoginPage.jsx"

function App() {

  return(
    <Routes>
      <Route path = "/" element = {<HomePage />} />
      <Route path = "/register" element = {<RegisterPage />} />
      <Route path = "/login" element = {<LoginPage />} />
    </Routes>
  )

}

export default App
