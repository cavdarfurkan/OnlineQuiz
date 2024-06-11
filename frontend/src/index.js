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
import Dashboard from "./pages/Dashboard";
import Root from "./pages/Root";
import ProtectedRoute from "./components/ProtectedRoute";
import CoursesList from "./pages/CoursesList";
import JoinCoursePage from "./pages/JoinCoursePage";
import CourseDetailsPage from "./pages/CourseDetailsPage";

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
    element: <ProtectedRoute />,
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
            element: <CoursesList />,
          },
          {
            path: "courses/join",
            element: <JoinCoursePage />,
          },
          {
            path: "courses/:id",
            element: <CourseDetailsPage />,
          },
          {
            path: "courses/:id/edit",
            element: <div>Edit Course</div>,
          },
          {
            path: "courses/:id/exams/:examId",
            element: <div>Yandik</div>,
          },
          {
            path: "courses/:id/exams/:examId/submit",
            element: <div>Submit Exam</div>,
          },
          {
            path: "courses/:id/exams/:examId/edit",
            element: <div>Edit Exam</div>,
          },
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
