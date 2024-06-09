import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/api";
import { userSlice } from "./features/user/userSlice";
import { sidebarSlice } from "../components/sidebar/sidebarSlice";
import {
  studentDashboardSlice,
  studentCoursesSlice,
  studentJoinCoursesSlice,
} from "./features/student/studentSlice";

import "./api/auth";
import "./api/course";
import "./api/exam";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userSlice.reducer,
    sidebar: sidebarSlice.reducer,
    studentDashboardSlice: studentDashboardSlice.reducer,
    studentCoursesSlice: studentCoursesSlice.reducer,
    studentJoinCoursesSlice: studentJoinCoursesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
