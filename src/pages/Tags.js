import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const TagSearchResults = () => {
  const { search } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`https://prod-api.3dpass.org:4000/search/${search}`);
        const addresses = response.data;

        if (addresses && addresses.length > 1) {
          setSearchResults(addresses);
        } else {
          alert(`No result found for the given tag: ${search}`);
        }
      } catch (error) {
        console.error(error);
        alert(`No result found for the given tag: ${search}`);
      }
    };

    fetchSearchResults();
  }, [search]);

  const headersTable = ["Address", "Display Name", "Discord", "Legal Name", "Twitter", "Email", "Web"];

  const prepareTableArray = (data) => {
    if (data && data.length > 0) {
      return data.map((item) => ({
        Address: item.address,
        "Display Name": item.displayName ? item.displayName : "-",
        Discord: item.discord ? item.discord.slice(0, 25) + (item.discord.length > 25 ? "..." : "") : "-",
        "Legal Name": item.legalName ? item.legalName : "-",
        Twitter: item.twitter ? item.twitter : "-",
        Email: item.email ? item.email : "-",
        Web: item.web ? item.web : "-"
      }));
    }
    return [];
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        {searchResults.length > 1 && (
          <table className="main-table">
            <thead>
              <tr>
                {headersTable.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prepareTableArray(searchResults).map((item, index) => (
                <tr key={index}>
                  {Object.keys(item).map((key, i) => (
                    <td key={i}>
                      {key === "Address" ? (
                        <Link to={`/account/${item[key]}`}>
                          {item[key].slice(0, 7)}...{item[key].slice(-7)}
                        </Link>
                      ) : (
                        item[key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TagSearchResults;
