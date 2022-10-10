import { Link, useNavigate } from "react-router-dom";

import moment from "moment";

const TransferPreview = ({ transfer }) => {
  const navigate = useNavigate();
  const {
    blockNumber,
    extrinsicIdx,
    toMultiAddressAccountId,
    fromMultiAddressAccountId,
    value,
    blockDatetime,
  } = transfer;

  const openAccount = (e, account) => {
    e.preventDefault();
    navigate("account/" + account);
  };

  return (
    <Link to={"/extrinsic/" + blockNumber + "-" + extrinsicIdx}>
      <div className="block-container">
        <div className="left-block-content">
          <div className="block-title">
            Extrinsic#<span>{blockNumber + "-" + extrinsicIdx}</span>
          </div>
        </div>
        <div className="right-block-content">
          <div className="block-value">{value / 1000000000000} P3D</div>
          <div className="block-time">{moment(blockDatetime).fromNow()}</div>
        </div>
        <div className="block-info">
          From{" "}
          <span
            className="ellipsis"
            title={fromMultiAddressAccountId}
            onClick={(e) => openAccount(e, fromMultiAddressAccountId)}
          >
            {fromMultiAddressAccountId}
          </span>{" "}
          to{" "}
          <span
            className="ellipsis"
            title={toMultiAddressAccountId}
            onClick={(e) => openAccount(e, toMultiAddressAccountId)}
          >
            {toMultiAddressAccountId}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TransferPreview;
