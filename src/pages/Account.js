import { ApiPromise, WsProvider } from "@polkadot/api";
import { Cell, Pie, PieChart } from "recharts";
import React, { useEffect, useState } from "react";

import ErrorData from "../components/ErrorData";
import ListInfo from "../components/ListInfo";
import Pagination from "../components/Pagination";
import QRCode from "react-qr-code";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import classNames from "classnames";
import moment from "moment";
import { useParams } from "react-router-dom";

const Account = () => {
  const { account } = useParams();
  const [accoutInfo, setAccountInfo] = useState({});
  const [activeMenu, setActiveMenu] = useState("Extrinsics");
  const [extrincts, setExtrincts] = useState([]);
  const extrinctsHeaders = ["Extrinsic ID", "Hash", "Time", "Result"];
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
  const [miner_raw, setMiner_raw] = useState("");
  const [errorData, setErrorData] = useState(false);
  const { u8aToHex } = require("@polkadot/util");
  const { Keyring } = require("@polkadot/keyring");
  const [judgements, setJudgements] = useState([]);
  const [deposit, setDeposit] = useState("");
  const [info, setInfo] = useState({});
  const [additional, setAdditional] = useState([]);
  const [displayRaw, setDisplayRaw] = useState("");
  const [legal, setLegal] = useState("");
  const [webRaw, setWebRaw] = useState("");
  const [riot, setRiot] = useState("");
  const [emailRaw, setEmailRaw] = useState("");
  const [pgpFingerprint, setPgpFingerprint] = useState("");
  const [image, setImage] = useState("");
  const [twitterRaw, setTwitterRaw] = useState("");
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
      const keyring = new Keyring();
      const minerEncoded = keyring.encodeAddress(account, 71);
      setMiner(minerEncoded);
      let minerDecoded;
      if (acc.startsWith("d1")) {
        const decodedAcc = keyring.decodeAddress(acc);
        const publicKey = u8aToHex(decodedAcc);
        minerDecoded = publicKey;
        setMiner_raw(minerDecoded);
      } else {
        minerDecoded = acc;
        setMiner_raw(minerDecoded);
      }
    };

    getAccountInfo(account);
  }, [account, Keyring]);

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
    let address;
    if (acc.startsWith("d1")) {
      const keyring = new Keyring({ ss58Format: 71, type: "sr25519" });
      const decodedAcc = keyring.decodeAddress(acc);
      const publicKey = u8aToHex(decodedAcc);
      address = publicKey;
    } else {
      address = acc;
    }
    const getTransfers = {
      query: `query{getExtrinsics(pageKey: "${pageKey}", pageSize: 10, filters: {multiAddressAccountId: "${address}"}){pageInfo{pageSize, pageNext, pagePrev} objects{ blockNumber, blockDatetime, extrinsicIdx, hash, complete }}}`,
    };

    const responseExtrincts = await axiosInstance.post("", getTransfers);
    if (responseExtrincts.data && responseExtrincts.data.data.getExtrinsics) {
      setExtrincts(responseExtrincts.data.data.getExtrinsics.objects);
      setPaginationE(responseExtrincts.data.data.getExtrinsics.pageInfo);
      setErrorData(false);
    } else {
      setErrorData(true);
    }
  };
  const getTransfersTo = async (acc, pageKey) => {
    let address;
    if (acc.startsWith("d1") || acc.startsWith("5")) {
      const keyring = new Keyring({ ss58Format: 71, type: "sr25519" });
      const decodedAcc = keyring.decodeAddress(acc);
      const publicKey = u8aToHex(decodedAcc);
      address = publicKey;
    } else {
      address = acc;
    }
    const postTransfers = {
      query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 10, filters: {toMultiAddressAccountId: "${address}"}){pageInfo{pageSize, pageNext, pagePrev} objects{ blockNumber, extrinsicIdx, eventIdx, fromMultiAddressAccountId, toMultiAddressAccountId, value }}}`,
    };

    const responseTransfers = await axiosInstance.post("", postTransfers);
    if (responseTransfers.data && responseTransfers.data.data.getTransfers) {
      setTransfersTo(responseTransfers.data.data.getTransfers.objects);
      setPaginationTo(responseTransfers.data.data.getTransfers.pageInfo);
      setErrorData(false);
    } else {
      setErrorData(true);
    }
  };

  const getTransfersFrom = async (acc, pageKey) => {
    const { u8aToHex } = require("@polkadot/util");
    const { Keyring } = require("@polkadot/keyring");

    let address;
    if (acc.startsWith("d1") || acc.startsWith("5")) {
      const keyring = new Keyring({ ss58Format: 71, type: "sr25519" });
      const decodedAcc = keyring.decodeAddress(acc);
      const publicKey = u8aToHex(decodedAcc);
      address = publicKey;
    } else {
      address = acc;
    }
    const postTransfers = {
      query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 10, filters: {fromMultiAddressAccountId: "${address}"}){pageInfo{pageSize, pageNext, pagePrev} objects{ blockNumber, extrinsicIdx, eventIdx, fromMultiAddressAccountId, toMultiAddressAccountId, value }}}`,
    };

    const responseTransfers = await axiosInstance.post("", postTransfers);
    if (responseTransfers.data && responseTransfers.data.data.getTransfers) {
      setTransferFrom(responseTransfers.data.data.getTransfers.objects);
      setPaginationFrom(responseTransfers.data.data.getTransfers.pageInfo);
      setErrorData(false);
    } else {
      setErrorData(true);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setJudgements([]);
      setDeposit("");
      setInfo({});
      setAdditional([]);
      setDisplayRaw("");
      setLegal("");
      setWebRaw("");
      setRiot("");
      setEmailRaw("");
      setPgpFingerprint("");
      setImage("");
      setTwitterRaw("");

      const identurl = `https://prod-api.3dpass.org:4000/identity/${miner}`;
      const response = await fetch(identurl);
      if (!response) {
        const data = await response.json();
        setJudgements(data.judgements || []);
        setDeposit(data.deposit || "");
        setInfo(data.info || {});
        setAdditional(data.info?.additional || []);
        setDisplayRaw(data.info?.display?.Raw || "");
        setLegal(data.info?.legal || "");
        setWebRaw(data.info?.web?.Raw || "");
        setRiot(data.info?.riot || "");
        setEmailRaw(data.info?.email?.Raw || "");
        setPgpFingerprint(data.info?.pgpFingerprint || "");
        setImage(data.info?.image || "");
        setTwitterRaw(data.info?.twitter?.Raw || "");
      } else {
        const data = await response.json();
        setJudgements(data.judgements || []);
        setDeposit(data.deposit || "");
        setInfo(data.info || {});
        setAdditional(
          data.info?.additional?.map((item) => ({
            name: item[0]?.Raw,
            value: item[1]?.Raw,
          })) || []
        );
        setDisplayRaw(data.info?.display?.Raw || "");
        setLegal(data.info?.legal || "");
        setWebRaw(data.info?.web?.Raw || "");
        setRiot(data.info?.riot || "");
        setEmailRaw(data.info?.email?.Raw || "");
        setPgpFingerprint(data.info?.pgpFingerprint || "");
        setImage(data.info?.image || "");
        setTwitterRaw(data.info?.twitter?.Raw || "");
      }
    };

    if (miner.startsWith("d1")) {
      fetchData();
    }
  }, [miner]);

  const prepareTableArray = (arr, type) => {
    if (!arr.length) {
      return [];
    }

    let array = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let fromEncoded;
      let toEncoded;

      if (
        !item ||
        (!item.fromMultiAddressAccountId && !item.toMultiAddressAccountId)
      ) {
        continue;
      }

      const keyring = new Keyring({ ss58Format: 71, type: "sr25519" });

      if (item.fromMultiAddressAccountId) {
        fromEncoded = keyring.encodeAddress(item.fromMultiAddressAccountId);
      }

      if (item.toMultiAddressAccountId) {
        toEncoded = keyring.encodeAddress(item.toMultiAddressAccountId);
      }

      if (type === "extrincts") {
        array.push([
          {
            val: item.blockNumber + "-" + item.extrinsicIdx,
            url: "/extrinsic/" + item.blockNumber + "-" + item.extrinsicIdx,
          },
          { val: item.hash },
          { val: moment(item.blockDatetime).fromNow() },
          { val: item.complete === 1 ? "Success" : "Not Success" },
        ]);
      }

      if (type === "transfersTo" || type === "transfersFrom") {
        array.push([
          { val: item.blockNumber, url: "/block/" + item.blockNumber },
          {
            val: item.blockNumber + "-" + item.extrinsicIdx,
            url: "/extrinsic/" + item.blockNumber + "-" + item.extrinsicIdx,
          },
          {
            val: fromEncoded,
            url: "/account/" + fromEncoded,
          },
          {
            val: toEncoded,
            url: "/account/" + toEncoded,
          },
          { val: item.value / 1000000000000 + " P3D" },
        ]);
      }
    }
    return array;
  };

  let judgementItems = [];

  if (judgements && judgements.length > 0) {
    judgements.forEach((judgement, index) => {
      judgementItems.push(
        <ListInfo
          key={`registrar-index-${index}`}
          title={`Registrar index (${index})`}
          info={judgement[0]}
          canCopy={false}
        />
      );

      if (typeof judgement[1] === "object") {
        for (const key in judgement[1]) {
          const value = judgement[1][key];
          judgementItems.push(
            <ListInfo
              key={`registrar-value-${index}-${key}`}
              title={key}
              info={value}
              canCopy={false}
            />
          );
        }
      } else {
        judgementItems.push(
          <ListInfo
            key={`registrar-level-${index}`}
            title={`Level of confidence (${index})`}
            info={judgement[1]}
            canCopy={false}
          />
        );
      }
    });
  }

  const data = [
    { name: "Locked", value: accoutInfo.miscFrozen, color: "#71CDA4" },
    { name: "Transferable", value: accoutInfo.transferable, color: "#d7d7d7" },
  ];

  return (
    <div className="page-content">
      <div className="main-inner">
        {!errorData && (
          <>
            <div className="list-container home-list-container">
              <div className="list-header">
                <div className="list-header-content">
                  <div className="list-icon user-icon"></div>
                  <div className="list-title">Account</div>
                </div>
              </div>
              <ListInfo title={"Account Id"} info={miner_raw} canCopy={true} />
              <ListInfo title={"Address"} info={miner} canCopy={true} />
              {judgementItems}
              {deposit && (
                <ListInfo
                  title={"Registrar fee"}
                  info={(
                    parseFloat(deposit.replaceAll(",", "")) / 1000000000000
                  ).toFixed(4)}
                  canCopy={false}
                />
              )}
              {displayRaw && (
                <div>
                  <ListInfo
                    title={"Name"}
                    info={info.display.Raw}
                    canCopy={false}
                  />
                </div>
              )}
              {legal && legal !== "None" && (
                <ListInfo title={"Legal"} info={legal.Raw} canCopy={false} />
              )}
              {webRaw && (
                <ListInfo title={"Web site"} info={webRaw} canCopy={false} />
              )}
              {riot && riot !== "None" && (
                <ListInfo title={"Riot"} info={riot} canCopy={false} />
              )}
              {emailRaw && (
                <ListInfo title={"Email"} info={emailRaw} canCopy={false} />
              )}
              {pgpFingerprint && (
                <ListInfo
                  title={"PGP fingerprint"}
                  info={pgpFingerprint}
                  canCopy={false}
                />
              )}
              {image && image !== "None" && (
                <ListInfo title={"image"} info={image} canCopy={false} />
              )}
              {twitterRaw && (
                <ListInfo title={"Twitter"} info={twitterRaw} canCopy={false} />
              )}
              {additional && additional.length > 0 && (
                <div>
                  {additional.map((item, index) => (
                    <ListInfo
                      key={index}
                      title={item.name}
                      info={item.value}
                      canCopy={false}
                    />
                  ))}
                </div>
              )}
              {/*    <div className="qr-code-holder">
                <QRCode
                  size={120}
                  value={window.location.href}
                  viewBox={`0 0 120 120`}
                />
              </div>
	   */}
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
                          <span className="block-span">{item.value} P3D</span>
                        </div>
                      </div>
                    ))}
                    <div className="one-graph-info">
                      Total Balance {accoutInfo.free} P3D
                    </div>
                  </div>
                </>
              )}
              {loading && <div className="loading-info">Loading data...</div>}
              <div className="qr-code-holder">
                <QRCode
                  size={120}
                  value={window.location.href}
                  viewBox={`0 0 120 120`}
                />
              </div>
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
          </>
        )}
        {errorData && (
          <ErrorData error={"No available data for Account " + account} />
        )}
      </div>
    </div>
  );
};

export default Account;
