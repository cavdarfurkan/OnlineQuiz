import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HeaderButton = ({ title, onClickCallback, link, targetId }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current && targetId) {
      buttonRef.current.setAttribute("data-bs-target", targetId);
      buttonRef.current.setAttribute("data-bs-toggle", "modal");
    }
  }, [targetId]);

  if (!onClickCallback) {
    return (
      <Link to={link} className="btn btn-primary ms-auto">
        {title}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-primary ms-auto"
      onClick={onClickCallback}
      ref={buttonRef}
    >
      {title}
    </button>
  );
};

export default HeaderButton;
