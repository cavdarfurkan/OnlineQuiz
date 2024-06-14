import { FaChevronRight, FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const CardItemOne = ({
  title,
  description,
  text,
  buttonLink = "",
  deleteCallback,
  disabled,
}) => {
  return (
    <div className="card text-bg-light">
      <div className="row align-items-center justify-content-between">
        <div className={buttonLink ? "col-sm-8 col-6" : "col-8"}>
          <div className="card-body">
            <div className="card-title">{title}</div>
            <div className="card-text">{description}</div>
            <small className="card-text text-muted">{text}</small>
          </div>
        </div>
        <div className="col-sm-4 col-6 d-flex justify-content-end">
          {deleteCallback && (
            <div className="text-end pe-5">
              <button
                className={
                  (disabled ? "disabled " : "") + "btn btn-danger d-flex"
                }
                onClick={deleteCallback}
              >
                <FaTrash />
              </button>
            </div>
          )}
          {buttonLink && (
            <div className="text-end pe-5">
              <Link
                to={buttonLink}
                className={
                  (disabled ? "disabled " : "") + "btn btn-primary d-flex"
                }
              >
                <FaChevronRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CardItemTwo = ({ title, description, text }) => {
  return (
    <div className="card text-bg-light">
      <div className="row align-items-center justify-content-between">
        <div className={"col-sm-8 col-6"}>
          <div className="card-body">
            <div className="card-title">{title}</div>
            <div className="card-text">{description}</div>
          </div>
        </div>
        {text && (
          <div className="col-sm-4 col-6 text-end pe-5">
            <div className="card-text text-danger">{text}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CardItemThree = ({ text, buttonLink = "" }) => {
  return (
    <div className="card text-bg-light">
      <div className="row align-items-center justify-content-between">
        <div className={buttonLink ? "col-sm-8 col-6" : "col-12"}>
          <div className="card-body">
            <div className="card-title">{text}</div>
          </div>
        </div>
        {buttonLink && (
          <div className="col-sm-4 col-6 text-end pe-5">
            <Link to={buttonLink} className="btn btn-primary">
              <FaChevronRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
