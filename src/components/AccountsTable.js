import { useState, useEffect } from "react";

const AccountsTable = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch("https://prod-api.3dpass.org:4000/accounts?=limit=100")
      .then((response) => response.json())
      .then((data) => {
        const accounts = data.map((account) => {
          let bal = account.balance;
          let balances = parseFloat(bal.toString().replace(/,/g, ""));
          let base = balances / 1000000000000;
          let balance;
          let suffix;

          if (base >= 1000) {
            let kilo = base / 1000;
            if (kilo >= 1000) {
              let million = kilo / 1000;
              balance = million.toFixed(4);
              suffix = "MP3D";
            } else {
              balance = kilo.toFixed(4);
              suffix = "kP3D";
            }
          } else {
            balance = base.toFixed(4);
            suffix = "P3D";
          }

          return {
            accountId: account.accountId[0],
            balance: parseFloat(balance),
            suffix: suffix,
            originalBalance: parseInt(account.balance),
          };
        });
        accounts.sort((a, b) => {
          const suffixOrder = { P3D: 1, kP3D: 2, MP3D: 3 };
          const aVal = a.balance * Math.pow(10, suffixOrder[a.suffix] * 3);
          const bVal = b.balance * Math.pow(10, suffixOrder[b.suffix] * 3);
          return bVal - aVal;
        });
        setAccounts(accounts.slice(0, 100));
      });
  }, []);

  return (
    <div>
	<div style={{ textAlign: "center", paddingTop: "20px", paddingBottom: "20px" }}>
  		<h2>Top Holders</h2>
      	</div>
      <table className="main-table">
      
        <thead>
          <tr>
	    <th>Rank</th>
            <th>Account ID</th>
            <th>Balance</th>
          </tr>
        </thead>
	<tbody>
          {accounts.map((account, index) => {
            return (
              <tr key={account.accountId}>
                <td>
                  {index + 1}
                </td>
                <td>
                  {account.accountId}
                </td>
                <td>
                  {account.balance.toFixed(4)} {account.suffix}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;

