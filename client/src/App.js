import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import HomePage from "./pages/Home";
import LoginPage from "./pages/login";
import LecturesPage from "./pages/lectures";
import DoctorsPage from "./pages/doctors";
import SubjectPage from "./pages/subject";
import ProductsPage from "./pages/products";
import EditUserPage from "./pages/editUser";
import { useState } from "react";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App flex">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          >
            <Route index element={<LecturesPage />}></Route>
            <Route
              path="/lectures"
              element={user ? <LecturesPage /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/Doctors"
              element={user ? <DoctorsPage /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/subjects"
              element={user ? <SubjectPage /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/products"
              element={user ? <ProductsPage /> : <Navigate to="/login" />}
            ></Route>
          </Route>
          <Route
            path="/Login"
            element={
              !user ? (
                <LoginPage />
              ) : user.user.user_year ? (
                <Navigate to="/lectures" />
              ) : (
                <Navigate to="/user/edit" />
              )
            }
          ></Route>
          <Route
            path="/user/edit"
            element={user ? <EditUserPage /> : <Navigate to="/login" />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
