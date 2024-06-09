import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";
import Cookies from "js-cookie";

export const getStudentDashboardData = createAsyncThunk(
  "exams/getStudentDashboardData",
  async (_, { dispatch }) => {
    const courses = await dispatch(
      api.endpoints.getCoursesByUser.initiate()
    ).unwrap();

    const courseIds = courses.map((course) => course.id);

    const examsRespond = await Promise.all(
      courseIds.map((courseId) =>
        dispatch(api.endpoints.getExamsByCourseId.initiate(courseId)).unwrap()
      )
    );

    let examsArray = [];
    for (let i = 0; i < examsRespond.length; i++) {
      const exams = examsRespond[i];

      for (let j = 0; j < exams.length; j++) {
        const exam = exams[j];
        examsArray.push(exam);
      }
    }

    const examsData = examsArray.map((exam) => {
      return {
        course_short_name: courses.find(
          (course) => course.id === exam.course_id
        ).short_name,
        exam_title: exam.title,
        exam_date: new Date(exam.date)
          .toISOString()
          .split("T")
          .join(" ")
          .split(".")[0]
          .replace("T", " "),
        exam: exam,
      };
    });

    const userId = JSON.parse(Cookies.get("user")).id;
    const studentExams = await dispatch(
      api.endpoints.getStudentExams.initiate(userId)
    ).unwrap();

    const gradesData = [];
    for (const studentExam of studentExams) {
      const exam = await dispatch(
        api.endpoints.getExamById.initiate(studentExam.exam_id)
      ).unwrap();
      const course = await dispatch(
        api.endpoints.getCourseById.initiate(exam.course_id)
      ).unwrap();
      gradesData.push({
        course_short_name: course.short_name,
        exam_title: exam.title,
        grade: studentExam.grade,
        course: course,
        exam: exam,
      });
    }

    return {
      scheduledExams: examsData,
      grades: gradesData,
    };
  }
);

export const studentDashboardSlice = createSlice({
  name: "studentDashboardSlice",
  initialState: {
    scheduledExams: [],
    grades: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudentDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduledExams = action.payload.scheduledExams;
        state.grades = action.payload.grades;
      })
      .addCase(getStudentDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

///////////////////////////

export const getStudentCourses = createAsyncThunk(
  "exams/getScheduledExams",
  async (_, { dispatch }) => {
    const courses = await dispatch(
      api.endpoints.getCoursesByUser.initiate()
    ).unwrap();

    const courseIds = courses.map((course) => course.id);

    const examsRespond = await Promise.all(
      courseIds.map((courseId) =>
        dispatch(api.endpoints.getExamsByCourseId.initiate(courseId)).unwrap()
      )
    );

    let examsArray = [];
    for (let i = 0; i < examsRespond.length; i++) {
      const exams = examsRespond[i];

      for (let j = 0; j < exams.length; j++) {
        const exam = exams[j];
        examsArray.push(exam);
      }
    }

    const examsData = examsArray.map((exam) => {
      return {
        course_short_name: courses.find(
          (course) => course.id === exam.course_id
        ).short_name,
        exam_title: exam.title,
        exam_date: new Date(exam.date)
          .toISOString()
          .split("T")
          .join(" ")
          .split(".")[0]
          .replace("T", " "),
        exam: exam,
      };
    });

    return {
      courses: courses,
      scheduledExams: examsData,
    };
  }
);

export const studentCoursesSlice = createSlice({
  name: "studentCoursesSlice",
  initialState: {
    courses: [],
    scheduledExams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudentCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.scheduledExams = action.payload.scheduledExams;
      })
      .addCase(getStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

///////////////////////////

export const joinCourse = createAsyncThunk(
  "exams/joinCourse",
  async ({ courseId, invitationQueryParam }, { dispatch }) => {
    const response = await dispatch(
      api.endpoints.joinCourse.initiate({ courseId, invitationQueryParam })
    ).unwrap();

    console.log(response);
  }
);

export const studentJoinCoursesSlice = createSlice({
  name: "studentJoinCoursesSlice",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(joinCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(joinCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});
