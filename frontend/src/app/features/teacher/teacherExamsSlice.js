import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { examApi } from "../../api/exam";

export const getExamsByCourse = createAsyncThunk(
  "teacher/getExams",
  async (courses, { dispatch }) => {
    const exams = [];

    for (const course of courses) {
      const courseExams = await dispatch(
        examApi.endpoints.getExamsByCourseId.initiate(course.id)
      ).unwrap();

      for (const exam of courseExams) {
        exams.push({
          examId: exam.id,
          examTitle: exam.title,
          examDate: new Date(exam.date)
            .toISOString()
            .split("T")
            .join(" ")
            .split(".")[0]
            .replace("T", " "),
          course_short_name: course.short_name,
        });
      }
    }

    return exams;
  }
);

export const teacherExamsSlice = createSlice({
  name: "teacherExams",
  initialState: {
    exams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExamsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExamsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(getExamsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});
