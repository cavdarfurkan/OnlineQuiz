import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const addQuestionSchema = Yup.object().shape({
  question: Yup.string()
    .min(5, "Question must be minimum 5")
    .required("Required")
    .trim(),
  option1: Yup.string().min(1).required("Required").trim(),
  option2: Yup.string().min(1).required("Required").trim(),
  option3: Yup.string().min(1).required("Required").trim(),
  option4: Yup.string().min(1).required("Required").trim(),
  answer: Yup.string().required("You have to select one correct answer").trim(),
});

const QuestionModal = ({ id, title, submitCallback, values }) => {
  const [formData, setFormData] = useState({
    question: values?.question || "",
    option1: values?.options[0]?.optionText || "",
    option2: values?.options[1]?.optionText || "",
    option3: values?.options[2]?.optionText || "",
    option4: values?.options[3]?.optionText || "",
    answer:
      values?.options.find((option) => option.isCorrect)?.optionText || "",
  });

  const handleSubmit = (values) => {
    const options = [
      { optionText: values.option1, isCorrect: values.answer === "option1" },
      { optionText: values.option2, isCorrect: values.answer === "option2" },
      { optionText: values.option3, isCorrect: values.answer === "option3" },
      { optionText: values.option4, isCorrect: values.answer === "option4" },
    ];

    const data = {
      questionText: values.question,
      options: options,
    };

    submitCallback(data);
  };

  return (
    <>
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        aria-labelledby={`${id}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${id}Label`}>
                {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <Formik
              initialValues={formData}
              validationSchema={addQuestionSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              <Form className="vstack gap-3">
                <div className="modal-body">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="question"
                      id="question"
                      className="form-control"
                      placeholder="Question"
                    />
                    <label htmlFor="question">Question</label>
                    <ErrorMessage
                      name="question"
                      component="div"
                      className="ms-1 text-danger tex-start form-text"
                    />
                  </div>

                  <div className="form-check d-flex align-items-center gap-2">
                    <Field
                      type="radio"
                      name="answer"
                      value="option1"
                      className="form-check-input"
                    />
                    <div className="form-floating w-100">
                      <Field
                        type="text"
                        name="option1"
                        id="option1"
                        className="form-control"
                        placeholder="Option 1"
                      />
                      <label htmlFor="option1">Option 1</label>
                      <ErrorMessage
                        name="option1"
                        component="div"
                        className="ms-1 text-danger tex-start form-text"
                      />
                    </div>
                  </div>

                  <div className="form-check d-flex align-items-center gap-2">
                    <Field
                      type="radio"
                      name="answer"
                      value="option2"
                      className="form-check-input"
                    />
                    <div className="form-floating w-100">
                      <Field
                        type="text"
                        name="option2"
                        className="form-control"
                        placeholder="Option 2"
                      />
                      <label htmlFor="option2">Option 2</label>
                      <ErrorMessage
                        name="option2"
                        component="div"
                        className="ms-1 text-danger tex-start form-text"
                      />
                    </div>
                  </div>

                  <div className="form-check d-flex align-items-center gap-2">
                    <Field
                      type="radio"
                      name="answer"
                      value="option3"
                      className="form-check-input"
                    />
                    <div className="form-floating w-100">
                      <Field
                        type="text"
                        name="option3"
                        className="form-control"
                        placeholder="Option 3"
                      />
                      <label htmlFor="option3">Option 3</label>
                      <ErrorMessage
                        name="option3"
                        component="div"
                        className="ms-1 text-danger tex-start form-text"
                      />
                    </div>
                  </div>

                  <div className="form-check d-flex align-items-center gap-2">
                    <Field
                      type="radio"
                      name="answer"
                      value="option4"
                      className="form-check-input"
                    />
                    <div className="form-floating w-100">
                      <Field
                        type="text"
                        name="option4"
                        className="form-control"
                        placeholder="Option 4"
                      />
                      <label htmlFor="option4">Option 4</label>
                      <ErrorMessage
                        name="option4"
                        component="div"
                        className="ms-1 text-danger tex-start form-text"
                      />
                    </div>
                  </div>
                  <ErrorMessage
                    name="answer"
                    component="div"
                    className="ms-1 text-danger tex-start form-text"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionModal;
