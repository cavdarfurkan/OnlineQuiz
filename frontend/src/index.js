import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Root from "./pages/Root";
import JoinCoursePage from "./pages/student/JoinCoursePage";
import CourseDetailsPage from "./pages/student/CourseDetailsPage";
import CourseExams from "./pages/student/CourseExams";
import ExamPage from "./pages/student/ExamPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import NewCoursePage from "./pages/teacher/NewCoursePage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    children: [
      {
        path: "admin",
      },
    ],
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    element: <ProtectedRoute roles={["student", "teacher", "admin"]} />,
    children: [
      {
        element: <Root />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "courses",
            element: <CoursesPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute roles={["student"]} />,
    children: [
      {
        element: <Root />,
        children: [
          {
            path: "courses/join",
            element: <JoinCoursePage />,
          },
          {
            path: "courses/:id",
            element: <CourseDetailsPage />,
          },
          {
            path: "courses/:id/exams",
            element: <CourseExams />,
          },
          {
            path: "exams/:examId",
            element: <ExamPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute roles={["teacher"]} />,
    children: [
      {
        element: <Root />,
        children: [
          {
            path: "courses/new",
            element: <NewCoursePage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute roles={["student", "teacher"]} />,
    children: [
      {
        element: <Root />,
        children: [
          {
            path: "profile",
            element: <div>Profile</div>,
          },
          {
            path: "settings",
            element: <div>Settings</div>,
          },
        ],
      },
    ],
  },
  {
    // Error page
    path: "*",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
