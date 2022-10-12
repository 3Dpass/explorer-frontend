import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Pagination from "../components/Pagination";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import moment from "moment";

const Blocks = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [pageKey, setPageKey] = useState(null);
  const [pagination, setPagination] = useState({});
  const headersTable = [
    "Block",
    "Hash",
    "Events",
    "Logs",
    "Extrinsics",
    "Status",
    "Time",
  ];

  useEffect(() => {
    setPageKey(page);
  }, [page, pageKey]);

  useEffect(() => {
    if (pageKey) {
      const getBlocks = async () => {
        const postData = {
          query: `query{getBlocks(pageKey: "${pageKey}", pageSize: 12){pageInfo{pageSize, pageNext, pagePrev}, objects{number, parentNumber, parentHash, stateRoot, hash, datetime, totalWeight, countExtrinsics, countEvents, countLogs, specName, complete}}}`,
        };

        const response = await axiosInstance.post("", postData);
        setBlocks(response.data.data.getBlocks.objects);
        setPagination(response.data.data.getBlocks.pageInfo);
      };
      getBlocks();
    }
  }, [pageKey]);

  const prepareTableArray = (arr) => {
    if (!arr.length) {
      return [];
    }

    let array = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      array.push([
        { val: item.number, url: "/block/" + item.number },
        { val: item.hash },
        { val: item.countEvents },
        { val: item.countLogs },
        { val: item.countExtrinsics },
        { val: item.complete ? "Success" : "Not Success" },
        { val: moment(item.datetime).fromNow() },
      ]);
    }

    return array;
  };

  const updatePage = (page) => {
    navigate("/blocks/" + page.toString());
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container">
          <div className="list-header mb10">
            <div className="list-header-content">
              <div className="list-icon cube-icon"></div>
              <div className="list-title">Blocks</div>
            </div>
          </div>
          <Table header={headersTable} array={prepareTableArray(blocks)} />
          <Pagination
            pagePrev={pagination.pagePrev}
            pageNext={pagination.pageNext}
            setPageKey={updatePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Blocks;
