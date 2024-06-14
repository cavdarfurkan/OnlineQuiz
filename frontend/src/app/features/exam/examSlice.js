import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { questionApi } from "../../api/question";
import { optionApi } from "../../api/option";
import { examApi } from "../../api/exam";

export const getExamDetails = createAsyncThunk(
  "exam/getExamDetails",
  async ({ examId }, { dispatch }) => {
    const data = [];

    const questions = await dispatch(
      questionApi.endpoints.getQuestionsByExamId.initiate({
        examIdQueryParam: examId,
      })
    ).unwrap();

    for (const question of questions) {
      const questionOptions = await dispatch(
        optionApi.endpoints.getOptionsByQuestionId.initiate({
          questionIdQueryParam: question.id,
        })
      ).unwrap();

      const options = [];
      for (const option of questionOptions) {
        options.push({
          optionId: option.id,
          option: option.option_text,
        });

        if (option.is_correct) {
          dispatch(
            addCorrectOption({
              questionId: question.id,
              correctOptionId: option.id,
            })
          );
        }
      }
      data.push({
        questionId: question.id,
        question: question.question_text,
        options: options,
      });
    }

    const exam = await dispatch(
      examApi.endpoints.getExamById.initiate(examId)
    ).unwrap();

    return {
      questions: data,
      duration: exam.duration_min,
    };
  }
);

export const submitExam = createAsyncThunk(
  "exam/submitExam",
  async ({ examId, startTime, endTime, answers }, { dispatch, getState }) => {
    const { correctOptions, questions } = getState().examSlice;

    let score = 0; // Amount of correct answers
    for (const questionId in answers) {
      try {
        await dispatch(
          examApi.endpoints.submitAnswers.initiate({
            questionId: questionId,
            answeredOptionId: answers[questionId],
          })
        ).unwrap();

        const correctOption = correctOptions.find((option) => {
          return option.questionId === parseInt(questionId);
        });

        if (correctOption.correctOptionId === parseInt(answers[questionId])) {
          score++;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const grade = (score / questions.length) * 100;

    const formattedStartTime = new Date(startTime)
      .toISOString()
      .split("T")
      .join(" ")
      .split(".")[0]
      .replace("T", " ");

    const formattedEndTime = new Date(endTime)
      .toISOString()
      .split("T")
      .join(" ")
      .split(".")[0]
      .replace("T", " ");

    try {
      await dispatch(
        examApi.endpoints.submitExam.initiate({
          examId: examId,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          grade: grade,
        })
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  }
);

export const examSlice = createSlice({
  name: "examSlice",
  initialState: {
    questions: [],
    correctOptions: [],
    duration: 0,
    startTime: 0,
    endTime: 0,
    grade: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    addCorrectOption: (state, action) => {
      state.correctOptions.push(action.payload);
    },
    setGrade: (state, action) => {
      state.grade = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExamDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExamDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload.questions;
        state.duration = action.payload.duration;
      })
      .addCase(getExamDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

///////////////////////////

export const newExamSlice = createSlice({
  name: "newExamSlice",
  initialState: {
    examTitle: "",
    examStartDate: "",
    examDuration: "",
    passPercent: "",
    examQuestions: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setExam: (state, action) => {
      const { examTitle, examStartDate, examDuration, passPercent } =
        action.payload;
      state.examTitle = examTitle;
      state.examStartDate = examStartDate;
      state.examDuration = examDuration;
      state.passPercent = passPercent;
    },
    addQuestion: (state, action) => {
      state.examQuestions.push(action.payload);
    },
  },
});

export const { setStartTime, setEndTime, addCorrectOption, setGrade } =
  examSlice.actions;

export const { setExam, addQuestion } = newExamSlice.actions;
