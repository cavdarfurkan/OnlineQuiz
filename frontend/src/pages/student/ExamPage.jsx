import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useTimer from "../../hooks/useTimer";
import {
  getExamDetails,
  setStartTime,
  setEndTime,
  submitExam,
} from "../../app/features/exam/examSlice";
import Loading from "../../components/Loading";
import { Field, Form, Formik } from "formik";

const ExamPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { examId } = useParams();
  const { questions, duration, startTime, isLoading, error } = useSelector(
    (state) => state.examSlice
  );

  const formikRef = useRef();

  useEffect(() => {
    dispatch(
      getExamDetails({
        examId: examId,
      })
    );
    dispatch(setStartTime(new Date().toISOString()));
  }, [dispatch, examId]);

  const [timerDuration, setTimerDuration] = useState(null);
  const timerStarted = useRef(false);

  const { minutes, seconds, start, stop } = useTimer({
    onEnd: () => {
      if (formikRef.current) {
        formikRef.current.submitForm();
      }
    },
  });

  useEffect(() => {
    if (duration > 0) {
      setTimerDuration(duration);
    }
  }, [duration]);

  useEffect(() => {
    if (timerDuration !== null && !timerStarted.current) {
      start(timerDuration);
      timerStarted.current = true;
    }
  }, [timerDuration]);

  const handleSubmit = async (values) => {
    stop();
    timerStarted.current = false;
    const { ...answers } = values;

    const endTime = new Date().toISOString();

    dispatch(setEndTime(endTime));
    dispatch(submitExam({ examId, startTime, endTime, answers }));

    navigate("/dashboard");
  };

  return (
    <div>
      <div>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Formik
            innerRef={formikRef}
            initialValues={{}}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="row justify-content-center">
                <div
                  role="group"
                  className="col-md-8 col-12 order-md-1 order-2 mx-3"
                >
                  {questions.map((question, index) => (
                    <div key={index} id={"question-" + index} className="mb-5">
                      <h3>{question.question}</h3>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="form-check">
                          <Field
                            key={optionIndex}
                            id={"question-" + index + "-" + optionIndex}
                            name={`${question.questionId}`}
                            type="radio"
                            value={`${option.optionId}`}
                            className="form-check-input"
                            disabled={!timerStarted.current}
                          />
                          <label
                            htmlFor={"question-" + index + "-" + optionIndex}
                            className="form-check-label"
                          >
                            {option.option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Timer */}
                <div className="col-md-2 col-12 d-flex flex-column gap-3 order-md-2 order-1 mb-5">
                  <div className="d-flex flex-column">
                    <span className="fs-4">Time left</span>
                    <span className="fs-5">
                      {minutes > 0 && `${minutes}m `}
                      {seconds > 0 && `${seconds}s`}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={!timerStarted.current}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};
export default ExamPage;
