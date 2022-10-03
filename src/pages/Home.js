import React, { useEffect, useState } from "react";

import BlockPreview from "../components/BlockPreview";
import { Link } from "react-router-dom";
import TransferPreview from "../components/TransferPreview";
import axiosInstance from "../api/axios";

const Home = () => {
  const [blocks, setBlocks] = useState([]);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    getBlocks();
    getTransfers();
  }, []);

  const getBlocks = async () => {
    const postData = {
      query: `{getBlocks(pageKey: "1", pageSize: 10){pageInfo{pageSize, pageNext, pagePrev}, objects{number, parentNumber, parentHash, stateRoot, hash, datetime, totalWeight, countExtrinsics, countEvents, countLogs, specName}}}`,
    };

    const response = await axiosInstance.post("", postData);
    setBlocks(response.data.data.getBlocks.objects);
  };

  const getTransfers = async () => {
    const postData = {
      query: `{getTransfers(pageKey: "1", pageSize: 10) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, value, blockDatetime, complete, fromMultiAddressType, fromMultiAddressAccountId, toMultiAddressType, toMultiAddressAccountId}}}`,
    };

    const response = await axiosInstance.post("", postData);
    setTransfers(response.data.data.getTransfers.objects);
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon cube-icon"></div>
              <div className="list-title">Blocks</div>
            </div>
            <Link to="/blocks">
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
            <Link to="/transfers">
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
