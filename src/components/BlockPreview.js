import { Link } from "react-router-dom";
import moment from "moment";

const BlockPreview = ({ block }) => {
  const { number, countEvents, countExtrinsics, countLogs, datetime } = block;

  return (
    <Link to={"/block/" + number}>
      <div className="block-container">
        <div className="left-block-content">
          <div className="block-title">
            Block#<span>{number}</span>
          </div>
          <div className="block-info">
            Includes: <span>{countEvents}</span> Events <span>{countLogs}</span>{" "}
            Logs <span>{countExtrinsics}</span> Extrinsics
          </div>
        </div>
        <div className="right-block-content">
          <div className="block-time">{moment(datetime).fromNow()}</div>
        </div>
      </div>
    </Link>
  );
};

export default BlockPreview;
