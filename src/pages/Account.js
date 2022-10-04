import { ApiPromise, WsProvider } from "@polkadot/api";
import { Cell, Pie, PieChart } from "recharts";
import React, { useEffect, useState } from "react";

import { Keyring } from "@polkadot/keyring";
import ListInfo from "../components/ListInfo";
import Pagination from "../components/Pagination";
import QRCode from "react-qr-code";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import classNames from "classnames";
import { useParams } from "react-router-dom";

const Account = () => {
  const { account } = useParams();
  const [accoutInfo, setAccountInfo] = useState({});
  const [activeMenu, setActiveMenu] = useState("Extrinsics");
  const [extrincts, setExtrincts] = useState([]);
  const extrinctsHeaders = ["Extrinsic ID", "Hash", "Completed"];
  const [pageKeyE, setPageKeyE] = useState(1);
  const [paginationE, setPaginationE] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageKeyTo, setPageKeyTo] = useState(1);
  const [paginationTo, setPaginationTo] = useState({});
  const [transfersTo, setTransfersTo] = useState([]);
  const transferToHeader = ["Block", "Extrinsic", "From", "To", "Value"];
  const [pageKeyFrom, setPageKeyFrom] = useState(1);
  const [paginationFrom, setPaginationFrom] = useState({});
  const [transfersFrom, setTransferFrom] = useState([]);
  const [miner, setMiner] = useState("");

  useEffect(() => {
    const getAccountInfo = async (acc) => {
      setLoading(true);
      const wsProvider = new WsProvider("wss://rpc2.3dpass.org");
      const api = await ApiPromise.create({ provider: wsProvider });
      const pero = await api.query.system.account(acc);
      const free =
        Number(pero.data.toHuman().free.replaceAll(",", "")) / 1000000000000;
      const miscFrozen =
        Number(pero.data.toHuman().miscFrozen.replaceAll(",", "")) /
        1000000000000;
      const feeFrozen =
        Number(pero.data.toHuman().feeFrozen.replaceAll(",", "")) /
        1000000000000;
      const reserved =
        Number(pero.data.toHuman().reserved.replaceAll(",", "")) /
        1000000000000;
      const transferable = free - miscFrozen;

      let objectAccount = {
        free: Math.round(free),
        miscFrozen: Math.round(miscFrozen),
        feeFrozen: Math.round(feeFrozen),
        reserved: Math.round(reserved),
        transferable: Math.round(transferable),
      };

      setAccountInfo(objectAccount);
      setLoading(false);
    };

    const keyring = new Keyring();
    const minerEncoded = keyring.encodeAddress(account, 71);
    setMiner(minerEncoded);

    getAccountInfo(account);
  }, [account]);

  useEffect(() => {
    getExtrincts(account, pageKeyE);
  }, [account, pageKeyE]);

  useEffect(() => {
    getTransfersTo(account, pageKeyTo);
  }, [account, pageKeyTo]);

  useEffect(() => {
    getTransfersFrom(account, pageKeyFrom);
  }, [account, pageKeyFrom]);

  const getExtrincts = async (acc, pageKey) => {
    const getTransfers = {
      query: `query{getExtrinsics(pageKey: "${pageKey}", pageSize: 10, filters: {multiAddressAccountId: "${acc}"}){pageInfo{pageSize, pageNext, pagePrev} objects{ blockNumber, extrinsicIdx, hash, complete }}}`,
    };

    const responseExtrincts = await axiosInstance.post("", getTransfers);

    setExtrincts(responseExtrincts.data.data.getExtrinsics.objects);
    setPaginationE(responseExtrincts.data.data.getExtrinsics.pageInfo);
  };

  const getTransfersTo = async (acc, pageKey) => {
    const postTransfers = {
      query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 10, filters: {toMultiAddressAccountId: "${acc}"}){pageInfo{pageSize, pageNext, pagePrev} objects{ blockNumber, extrinsicIdx, eventIdx, fromMultiAddressAccountId, toMultiAddressAccountId, value }}}`,
    };

    const responseTransfers = await axiosInstance.post("", postTransfers);

    setTransfersTo(responseTransfers.data.data.getTransfers.objects);
    setPaginationTo(responseTransfers.data.data.getTransfers.pageInfo);
  };

  const getTransfersFrom = async (acc, pageKey) => {
    const postTransfers = {
      query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 10, filters: {fromMultiAddressAccountId: "${acc}"}){pageInfo{pageSize, pageNext, pagePrev} objects{ blockNumber, extrinsicIdx, eventIdx, fromMultiAddressAccountId, toMultiAddressAccountId, value }}}`,
    };

    const responseTransfers = await axiosInstance.post("", postTransfers);
    setTransferFrom(responseTransfers.data.data.getTransfers.objects);
    setPaginationFrom(responseTransfers.data.data.getTransfers.pageInfo);
  };

  const prepareTableArray = (arr, type) => {
    if (!arr.length) {
      return [];
    }

    let array = [];

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      if (type === "extrincts") {
        array.push([
          { val: item.blockNumber + "-" + item.extrinsicIdx },
          { val: item.hash },
          { val: item.complete === 1 ? "Success" : "Not Success" },
        ]);
      }

      if (type === "transfersTo" || type === "transfersFrom") {
        array.push([
          { val: item.blockNumber, url: "/block/" + item.blockNumber },
          {
            val: item.blockNumber + "-" + item.extrinsicIdx,
            url:
              "/extrinsic/" +
              item.blockNumber +
              "-" +
              item.extrinsicIdx +
              "/" +
              item.eventIdx,
          },
          {
            val: item.fromMultiAddressAccountId,
            url: "/account/" + item.fromMultiAddressAccountId,
          },
          {
            val: item.toMultiAddressAccountId,
            url: "/account/" + item.toMultiAddressAccountId,
          },
          { val: item.value / 1000000000000 + " P3D" },
        ]);
      }
    }

    return array;
  };

  const data = [
    { name: "Locked", value: accoutInfo.miscFrozen, color: "#71CDA4" },
    { name: "Transferable", value: accoutInfo.transferable, color: "#d7d7d7" },
  ];

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon account-icon"></div>
              <div className="list-title">Account</div>
            </div>
          </div>
          <ListInfo title={"Account Id"} info={account} canCopy={true} />
          <ListInfo title={"Miner"} info={miner} canCopy={true} />
          <div className="qr-code-holder">
            <QRCode
              size={120}
              value={window.location.href}
              viewBox={`0 0 120 120`}
            />
          </div>
        </div>
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon graph-icon"></div>
              <div className="list-title">Balance</div>
            </div>
          </div>
          {!loading && (
            <>
              <div className="graph-holder-account">
                <PieChart width={200} height={200}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((item, index) => (
                      <Cell key={`cell-${index}`} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="graph-info-account">
                {data.map((item, i) => (
                  <div className="one-graph-info" key={i}>
                    <div
                      className="graph-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="graph-label">
                      {item.name}{" "}
                      <span className="block-span">{item.value}</span>
                    </div>
                  </div>
                ))}
                <div className="one-graph-info">Total {accoutInfo.free}</div>
              </div>
            </>
          )}
          {loading && <div className="loading-info">Loading data...</div>}
        </div>
        <div className="list-container blocks-list-container account-table-container">
          <div className="main-menu">
            <div
              className={classNames({
                "menu-item": true,
                active: activeMenu === "Extrinsics",
              })}
              onClick={() => setActiveMenu("Extrinsics")}
            >
              Extrinsics
            </div>
            <div
              className={classNames({
                "menu-item": true,
                active: activeMenu === "Transfers To",
              })}
              onClick={() => setActiveMenu("Transfers To")}
            >
              Transfers to Account
            </div>
            <div
              className={classNames({
                "menu-item": true,
                active: activeMenu === "Transfers From",
              })}
              onClick={() => setActiveMenu("Transfers From")}
            >
              Transfers from Account
            </div>
          </div>
          {activeMenu === "Extrinsics" && (
            <>
              <Table
                header={extrinctsHeaders}
                array={prepareTableArray(extrincts, "extrincts")}
              />
              {extrincts.length === 0 && (
                <div className="empty-state">No available data.</div>
              )}
              <Pagination
                pagePrev={paginationE.pagePrev}
                pageNext={paginationE.pageNext}
                setPageKey={setPageKeyE}
              />
            </>
          )}
          {activeMenu === "Transfers To" && (
            <>
              <Table
                header={transferToHeader}
                array={prepareTableArray(transfersTo, "transfersTo")}
              />
              {transfersTo.length === 0 && (
                <div className="empty-state">No available data.</div>
              )}
              <Pagination
                pagePrev={paginationTo.pagePrev}
                pageNext={paginationTo.pageNext}
                setPageKey={setPageKeyTo}
              />
            </>
          )}
          {activeMenu === "Transfers From" && (
            <>
              <Table
                header={transferToHeader}
                array={prepareTableArray(transfersFrom, "transfersFrom")}
              />
              {transfersFrom.length === 0 && (
                <div className="empty-state">No available data.</div>
              )}
              <Pagination
                pagePrev={paginationFrom.pagePrev}
                pageNext={paginationFrom.pageNext}
                setPageKey={setPageKeyFrom}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
