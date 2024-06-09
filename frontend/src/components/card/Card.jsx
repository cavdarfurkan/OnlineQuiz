const Card = ({ title, children }) => {
  return (
    <div className={"card"}>
      {title && (
        <div className="card-header fs-5 d-flex align-items-center">
          {title}
          {/* <button type="button" className="btn btn-primary ms-auto">Add</button> */}
        </div>
      )}
      <div className="d-flex flex-column gap-3 p-3">{children}</div>
    </div>
  );
};

export default Card;
