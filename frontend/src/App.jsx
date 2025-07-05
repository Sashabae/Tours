import { BrowserRouter, Route, Routes } from "react-router";

import ProtectedRoute from "./components/ProtectedRoute";

// LAYOUT
import Layout from "./layout/Layout";

// PAGES
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import GroupTours from "./pages/tours/GroupTours";
import IndividualTours from "./pages/tours/IndividualTours";
import AllTours from "./pages/tours/AllTours";
import MyTours from "./pages/user/MyTours";
import TourDetails from "./pages/tours/TourDetails";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ADMIN
import Registrations from "./pages/admin/Registrations";
import EditTour from "./pages/admin/EditTour";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="/tours/individual" element={<IndividualTours />} />
            <Route path="/tours/group" element={<GroupTours />} />
            <Route path="/tours" element={<AllTours />} />
            <Route path="/tours/:id" element={<TourDetails />} />

            <Route path="*" element={<NotFound />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/mytours"
              element={
                <ProtectedRoute>
                  <MyTours />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registrations"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Registrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tours/edit/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditTour />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
