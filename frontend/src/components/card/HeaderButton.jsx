import { Link } from "react-router-dom";

const HeaderButton = ({ title, onClickCallback }) => {
  if (!onClickCallback) {
    return (
      <Link to="/courses/new" className="btn btn-primary ms-auto">
        {title}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-primary ms-auto"
      onClick={onClickCallback}
    >
      {title}
    </button>
  );
};

export default HeaderButton;
