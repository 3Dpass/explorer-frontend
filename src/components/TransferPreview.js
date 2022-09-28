import { Link } from "react-router-dom";
import moment from "moment";

const TransferPreview = ({ transfer }) => {
  const {
    blockNumber,
    extrinsicIdx,
    toMultiAddressAccountId,
    value,
    blockDatetime,
  } = transfer;

  return (
    <Link to={"/extrinsic/" + blockNumber + "-" + extrinsicIdx}>
      <div className="block-container">
        <div className="left-block-content">
          <div className="block-title">
            Extrinsic#<span>{blockNumber + "-" + extrinsicIdx}</span>
          </div>
          <div className="block-info">
            From <span>Faucet</span> to{" "}
            <span className="ellipsis" title={toMultiAddressAccountId}>
              {toMultiAddressAccountId}
            </span>
          </div>
        </div>
        <div className="right-block-content">
          <div className="block-value">{value / 1000000000000} P3D</div>
          <div className="block-time">{moment(blockDatetime).fromNow()}</div>
        </div>
      </div>
    </Link>
  );
};

export default TransferPreview;
