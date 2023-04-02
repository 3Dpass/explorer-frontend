import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MainSearch = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [search, setSearch] = useState("");
  const [chosenOption, setChosenOption] = useState("Block");
  const options = ["Block", "Extrinsic", "Account", "Event", "Tag"];

  useEffect(() => {
    setSearch("");
  }, [location]);

  const submitSearch = async (e) => {
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

    if (chosenOption === "Tag") {
      try {
        const response = await axios.get(`https://prod-api.3dpass.org:4000/search/${search}`);
        const addresses = response.data;
        
        if (addresses && addresses.length > 1) {
          navigate(`/tag/${search}`, { state: { search } });
        } else if (addresses && addresses.length === 1) {
          const address = addresses[0].address;
          navigate(`/account/${address}`);
        } else {
          alert("No result found for the given tag.");
        }
      } catch (error) {
        console.error(error);
        alert(`No result found for the given tag: ${search}`);
      }
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
        placeholder="Search by Block / Extrinsic / Account / Event / Tag"
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
