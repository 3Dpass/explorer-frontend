import { Link } from "react-router-dom";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation().pathname.replace("/", "");

  return (
    <header className="header">
      <div className="inner-header">
        <Link to="/" className="inline-middle">
          <div className="header-logo"></div>
        </Link>
        <div className="header-items">
          <Link
            to="/blocks"
            className={classNames({
              "header-item": true,
              active: location === "blocks",
            })}
          >
            Blocks
          </Link>
          <Link
            to="/transfers"
            className={classNames({
              "header-item": true,
              active: location === "transfers",
            })}
          >
            Transfers
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
