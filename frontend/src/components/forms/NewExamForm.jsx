import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import Card from "../card/Card";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setExam, addQuestion } from "../../app/features/exam/examSlice";
import QuestionModal from "../QuestionModal";
import { FaTrash } from "react-icons/fa6";
import { useCreateExamMutation } from "../../app/api/exam";
import { useCreateQuestionMutation } from "../../app/api/question";
import { useCreateOptionMutation } from "../../app/api/option";

const newExamSchema = Yup.object().shape({
  examTitle: Yup.string()
    .min(3, "Title is too short")
    .required("Required")
    .trim(),
  examStartDate: Yup.date("Invalid date").required("Start date is required"),
  examDuration: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  passPercent: Yup.number()
    .required("Pass percent is required")
    .min(1, "Pass percent must be at least 1")
    .max(100, "Pass percent must be at most 100"),
});

const NewExamForm = () => {
  const [questions, setQuestions] = useState([]);

  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { examQuestions } = useSelector((state) => state.newExamSlice);

  const [formData, setFormData] = useState({
    examTitle: "",
    examStartDate: "",
    examDuration: "",
    passPercent: "",
  });

  const [createExam, { isError, isLoading, error }] = useCreateExamMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [createOption] = useCreateOptionMutation();

  const handleSubmit = async (values) => {
    setFormData(values);
    dispatch(setExam(values));

    try {
      const { id: examId } = await createExam({
        title: values.examTitle,
        date: values.examStartDate,
        duration_min: values.examDuration,
        pass_percent: values.passPercent,
        course_id: courseId,
      }).unwrap();

      for (const question of examQuestions) {
        const { id: questionId } = await createQuestion({
          examId: examId,
          questionText: question.values.questionText,
        }).unwrap();

        for (const option of question.values.options) {
          const { id: optionId } = await createOption({
            questionId: questionId,
            optionText: option.optionText,
            isCorrect: Number(option.isCorrect),
          }).unwrap();
        }
      }

      toast.success("Exam created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error creating exam");
    }
  };

  const handleCancel = () => {
    setFormData({
      examTitle: "",
      examStartDate: "",
      examDuration: "",
      passPercent: "",
    });

    return navigate(`/courses/${courseId}/exams`);
  };

  const handleAddQuestion = (values) => {
    setQuestions([...questions, values]);
    dispatch(addQuestion({ values }));
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((question, i) => i !== index);
    setQuestions(newQuestions);
    console.log(newQuestions);
  };

  return (
    <>
      <QuestionModal
        id="addQuestionModal"
        title="Add question"
        submitCallback={handleAddQuestion}
      />

      <Formik
        initialValues={{ ...formData }}
        validationSchema={newExamSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        <Form className="vstack gap-3">
          <div className="form-floating">
            <Field
              type="text"
              name="examTitle"
              id="examTitle"
              className="form-control"
              placeholder="Exam Title"
            />
            <label htmlFor="examTitle">Exam Title</label>
            <ErrorMessage
              name="examTitle"
              component="div"
              className="ms-1 text-danger tex-start form-text"
            />
          </div>

          <div className="input-group gap-2">
            <div className="form-floating">
              <Field
                type="date"
                id="examStartDate"
                name="examStartDate"
                placeholder="Exam Start Date"
                className="form-control"
              />
              <label htmlFor="examStartDate">Exam Start Date</label>
              <ErrorMessage
                name="examStartDate"
                component="div"
                className="ms-1 text-danger text-start form-text"
              />
            </div>

            <div className="form-floating">
              <Field
                type="number"
                id="examDuration"
                name="examDuration"
                placeholder="Exam Duration"
                className="form-control"
                min="1"
              />
              <label htmlFor="examDuration">Exam Duration Minutes</label>
              <ErrorMessage
                name="examDuration"
                component="div"
                className="ms-1 text-danger text-start form-text"
              />
            </div>
          </div>

          <div>
            <Card
              title="Add questions"
              headerButtonCallback={() => {}}
              headerButtonText={<FaPlus />}
              targetId="#addQuestionModal"
            >
              {questions.map((question, index) => (
                <div
                  key={index}
                  id={"question-" + index}
                  className="mb-2 border-bottom d-flex justify-content-between align-items-center"
                >
                  <h3>{question.questionText}</h3>
                  <div className="d-flex gap-2">
                    <div
                      className="btn btn-danger"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <FaTrash />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="form-floating">
            <Field
              type="number"
              name="passPercent"
              id="passPercent"
              className="form-control"
              placeholder="Pass Percent"
              min="1"
              max="100"
            />
            <label htmlFor="passPercent">Pass Percent</label>
            <ErrorMessage
              name="passPercent"
              component="div"
              className="ms-1 text-danger tex-start form-text"
            />
          </div>

          <div className="mt-2">
            {isError && (
              <div className="alert alert-danger" role="alert">
                {error?.data?.message ??
                  (Array.isArray(error?.data.errors) &&
                    error?.data.errors.join(", "))}
              </div>
            )}
            <div className="d-flex justify-content-end gap-1">
              <button
                className="btn btn-danger"
                type="reset"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}
              >
                Create Exam
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default NewExamForm;
