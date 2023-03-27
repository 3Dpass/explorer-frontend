import { Link } from "react-router-dom";
import MainSearch from "./MainSearch";
import classNames from "classnames";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation().pathname.replace("/", "");
  
  const handleLogoClick = () => {
    location.reload();
  };


  return (
    <header className="header">
      <div className="inner-header">
       <Link to="" className="inline-middle" onClick={handleLogoClick}>
          <div className="header-logo"></div>
        </Link>
        <div className="header-items">
          <Link
            to="/blocks/1"
            className={classNames({
              "header-item": true,
              active: location.indexOf("blocks") > -1,
            })}
          >
            Blocks
          </Link>
          <Link
            to="/transfers/1"
            className={classNames({
              "header-item": true,
              active: location.indexOf("transfers") > -1,
            })}
          >
            Transfers
          </Link>
          <Link
            to="/events/1"
            className={classNames({
              "header-item": true,
              active: location.indexOf("events") > -1,
            })}
          >
            Events
          </Link>
	<Link
            to="/top-holder"
            className={classNames({
              "header-item": true,
              active: location.indexOf("top-holder") > -1,
            })}
          >
            Top Holders
          </Link>
        </div>
        <MainSearch />
      </div>
    </header>
  );
};

export default Header;
