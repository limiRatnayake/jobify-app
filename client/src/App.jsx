import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Register,
  DashboardLayout,
  Error,
  Login,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
  EditJob,
} from "./pages";
import { registerFormAction } from "./pages/Register";
import { loginFormAction } from "./pages/Login";
import { dashboardLoader } from "./pages/DashboardLayout";
import { createJobAction } from "./pages/AddJob";
import { allJobLoader } from "./pages/AllJobs";
import { editJobLoader } from "./pages/EditJob";
import { editJobAction } from "./pages/EditJob";
import { deleteJobLoader } from "./pages/DeleteJob";
import { adminStatsLoader } from "./pages/Admin";
import { profileAction } from "./pages/Profile";
import { statsLoader } from "./pages/Stats";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
        action: registerFormAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginFormAction,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AddJob />,
            action: createJobAction,
          },
          {
            path: "stats",
            element: <Stats />,
            loader: statsLoader,
            errorElement: <h4>There was an error...</h4>,
          },
          {
            path: "all-jobs",
            element: <AllJobs />,
            loader: allJobLoader,
          },
          {
            path: "profile",
            element: <Profile />,
            action: profileAction,
          },
          {
            path: "Admin",
            element: <Admin />,
            loader: adminStatsLoader,
          },
          {
            path: "edit-job/:id",
            element: <EditJob />,
            loader: editJobLoader,
            action: editJobAction,
          },
          {
            path: "delete-job/:id",
            action: deleteJobLoader,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
