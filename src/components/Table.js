import { Link } from "react-router-dom";
import React from "react";

const Table = ({ header, array }) => {
  return (
    <table className="main-table">
      <tbody>
        <tr>
          {header.map((title, i) => (
            <th key={i}>{title}</th>
          ))}
        </tr>
        {array.map((item, i) => (
          <tr key={i}>
            {item.map((info, k) => (
              <React.Fragment key={k}>
                {info.val !== "" && !info.url && <td>{info.val}</td>}
                {info.url && (
                  <td>
                    <Link to={info.url}>{info.val}</Link>
                  </td>
                )}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
