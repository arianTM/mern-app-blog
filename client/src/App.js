// import logo from "./logo.svg";
import "./App.css";
import Layout from "./components/Layout.js";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import UserContextProvider from "./context/UserContext.js";

export default function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
