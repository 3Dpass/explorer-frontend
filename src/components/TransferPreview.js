import { Link, useNavigate } from "react-router-dom";
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';
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

  //const keyring = new Keyring({ ss58Format: 71, type: 'sr25519'});
  const toMultiAddressAccounts = toMultiAddressAccountId.split(",");
  const fromMultiAddressAccounts = fromMultiAddressAccountId.split(",");
  const to = [];
  const from = [];

  for (let i = 0; i < toMultiAddressAccounts.length; i++) {
    const keyring = new Keyring({ ss58Format: 71, type: 'sr25519'});
    const decodedToAcc = keyring.encodeAddress(toMultiAddressAccounts[i], 71);
    to.push(decodedToAcc);
  }

  for (let i = 0; i < fromMultiAddressAccounts.length; i++) {
    const keyring = new Keyring({ ss58Format: 71, type: 'sr25519'});
    const decodedFromAcc = keyring.encodeAddress(fromMultiAddressAccounts[i], 71);
    from.push(decodedFromAcc);
  }
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
          {from.map((acc, index) => (
            <span
              key={index}
              className="ellipsis"
              title={acc}
              onClick={(e) => openAccount(e, acc)}
            >
              {acc}
            </span>
          ))}{" "}
          to{" "}
          {to.map((acc, index) => (
            <span
              key={index}
              className="ellipsis"
              title={acc}
              onClick={(e) => openAccount(e, acc)}
            >
              {acc}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default TransferPreview;
