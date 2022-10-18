import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MainSearch = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [search, setSearch] = useState("");
  const [chosenOption, setChosenOption] = useState("Block");
  const options = ["Block", "Extrinsic", "Account", "Event"];

  useEffect(() => {
    setSearch("");
  }, [location]);

  const submitSearch = (e) => {
    e.preventDefault();

    if (search === "") {
      return false;
    }

    if (chosenOption === "Block") {
      navigate("/block/" + search);
    }

    if (chosenOption === "Extrinsic") {
      navigate("/extrinsic/" + search);
    }

    if (chosenOption === "Account") {
      navigate("/account/" + search);
    }

    if (chosenOption === "Event") {
      navigate("/event/" + search);
    }
  };

  return (
    <form className="search-container" onSubmit={(e) => submitSearch(e)}>
      <select
        className="main-select"
        value={chosenOption}
        onChange={(e) => setChosenOption(e.target.value)}
      >
        {options.map((item, i) => (
          <option value={item} key={i}>
            {item}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="search-input"
        placeholder="Search by Block / Extrinsic / Account / Event"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
};

export default MainSearch;
