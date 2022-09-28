import classNames from "classnames";

const Pagination = ({ pagePrev, pageNext, setPageKey }) => {
  return (
    <div className="pagination-container">
      <div
        className={classNames({
          "button-pagination": true,
          "previous-icon": true,
          "first-btn": true,
          disabled: !pagePrev,
        })}
        title="Previous"
        onClick={pagePrev ? () => setPageKey(parseInt(pagePrev)) : null}
      ></div>
      <div
        className={classNames({
          "button-pagination": true,
          "next-icon": true,
          disabled: !pageNext,
        })}
        title="Next"
        onClick={pageNext ? () => setPageKey(parseInt(pageNext)) : null}
      ></div>
    </div>
  );
};

export default Pagination;
