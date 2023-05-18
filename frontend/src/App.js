import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import AttractionCreatePage from "main/pages/Attractions/AttractionCreatePage";
import AttractionDetailsPage from "main/pages/Attractions/AttractionDetailsPage";
import AttractionEditPage from "main/pages/Attractions/AttractionEditPage";
import AttractionIndexPage from "main/pages/Attractions/AttractionIndexPage";


import TransportCreatePage from "main/pages/Transports/TransportCreatePage";
import TransportDetailsPage from "main/pages/Transports/TransportDetailsPage";
import TransportEditPage from "main/pages/Transports/TransportEditPage";
import TransportIndexPage from "main/pages/Transports/TransportIndexPage";

import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";


import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/attractions/create" element={<AttractionCreatePage />} />
              <Route exact path="/attractions/edit/:id" element={<AttractionEditPage />} />
              <Route exact path="/attractions/details/:id" element={<AttractionDetailsPage />} />
              <Route exact path="/attractions/" element={<AttractionIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>

              <Route exact path="/transport/create" element={<TransportCreatePage />} />
              <Route exact path="/transport/edit/:id" element={<TransportEditPage />} />
              <Route exact path="/transport/details/:id" element={<TransportDetailsPage />} />
              <Route exact path="/transport/" element={<TransportIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>

              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
              <Route exact path="/restaurants/" element={<RestaurantIndexPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;
