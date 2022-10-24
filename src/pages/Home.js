import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useEffect, useState } from "react";

import BlockPreview from "../components/BlockPreview";
import { Link } from "react-router-dom";
import TransferPreview from "../components/TransferPreview";
import axiosInstance from "../api/axios";

const Home = () => {
  const [blocks, setBlocks] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [latestBlock, setLatestBlock] = useState(0);
  const [totalInsurance, setTotalInsurance] = useState("-");

  useEffect(() => {
    getBlocks();
    getTransfers();
    getInfo();
  }, []);

  const getBlocks = async () => {
    const postData = {
      query: `{getBlocks(pageKey: "1", pageSize: 10){pageInfo{pageSize, pageNext, pagePrev}, objects{number, parentNumber, parentHash, stateRoot, hash, datetime, totalWeight, countExtrinsics, countEvents, countLogs, specName}}}`,
    };

    const response = await axiosInstance.post("", postData);
    setBlocks(response.data.data.getBlocks.objects);
    setLatestBlock(response.data.data.getBlocks.objects[0].number);
  };

  const getTransfers = async () => {
    const postData = {
      query: `{getTransfers(pageKey: "1", pageSize: 10) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, value, blockDatetime, complete, fromMultiAddressType, fromMultiAddressAccountId, toMultiAddressType, toMultiAddressAccountId}}}`,
    };

    const response = await axiosInstance.post("", postData);
    setTransfers(response.data.data.getTransfers.objects);
  };

  const getInfo = async () => {
    const wsProvider = new WsProvider("wss://rpc2.3dpass.org");
    const api = await ApiPromise.create({ provider: wsProvider });
    const lol = await api.query.balances.totalIssuance();
    const lolNumber = lol.toHuman().replaceAll(",", "");

    const dividedLol = Number(lolNumber) / 1000000000000;
    const totalInsuranceVal = dividedLol / 1000000;

    setTotalInsurance(totalInsuranceVal.toFixed(4));
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container home-info-container">
          <div className="home-info">
            <div className="home-info-icon cube-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Latest Block</div>
              <div className="home-info-value">{latestBlock}</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon note-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Signed Extrinsic</div>
              <div className="home-info-value">-</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon transfer-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Transfers</div>
              <div className="home-info-value">-</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon user-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Holders</div>
              <div className="home-info-value">-</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon graph-home-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Total Insurance</div>
              <div className="home-info-value">{totalInsurance} MP3DT</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon coin-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Current Price</div>
              <div className="home-info-value">0.00495 $</div>
            </div>
          </div>
        </div>
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon cube-icon"></div>
              <div className="list-title">Blocks</div>
            </div>
            <Link to="/blocks/1">
              <div className="main-btn">View All</div>
            </Link>
          </div>
          {blocks.map((item, i) => (
            <BlockPreview block={item} key={i} />
          ))}
        </div>
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Transfers</div>
            </div>
            <Link to="/transfers/1">
              <div className="main-btn">View All</div>
            </Link>
          </div>
          {transfers.map((item, i) => (
            <TransferPreview transfer={item} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
