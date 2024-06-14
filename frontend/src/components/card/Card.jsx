import HeaderButton from "./HeaderButton";

const Card = ({
  title,
  headerButtonText,
  headerButtonCallback,
  headerButtonLink,
  targetId,
  children,
}) => {
  return (
    <div className={"card"}>
      {title && (
        <div className="card-header fs-5 d-flex align-items-center">
          {title}
          {headerButtonText && (
            <HeaderButton
              title={headerButtonText}
              link={headerButtonLink}
              onClickCallback={headerButtonCallback}
              targetId={targetId}
            />
          )}
        </div>
      )}
      <div className="d-flex flex-column gap-3 p-3">{children}</div>
    </div>
  );
};

export default Card;
