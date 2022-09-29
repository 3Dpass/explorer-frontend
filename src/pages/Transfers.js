import React, { useEffect, useState } from "react";

import Pagination from "../components/Pagination";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import moment from "moment";

const Blocks = () => {
  const [transfers, setTransfers] = useState([]);
  const [pageKey, setPageKey] = useState(1);
  const [pagination, setPagination] = useState({});
  const headersTable = [
    "Extrinsic",
    "Block",
    "From",
    "To",
    "Value",
    "Block Time",
  ];

  useEffect(() => {
    const getTransfers = async () => {
      const postData = {
        query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 12) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, value, blockDatetime, complete, fromMultiAddressType, fromMultiAddressAccountId, toMultiAddressType, toMultiAddressAccountId}}}`,
      };

      const response = await axiosInstance.post("", postData);
      setTransfers(response.data.data.getTransfers.objects);
      setPagination(response.data.data.getTransfers.pageInfo);
    };
    getTransfers();
  }, [pageKey]);
  const prepareTableArray = (arr) => {
    if (!arr.length) {
      return [];
    }

    let array = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      array.push([
        {
          val: item.blockNumber + "-" + item.extrinsicIdx,
          url: "/extrinsic/" + item.blockNumber + "-" + item.extrinsicIdx,
        },
        {
          val: item.blockNumber,
          url: "/block/" + item.blockNumber,
        },
        { val: "Faucet" },
        { val: item.toMultiAddressAccountId },
        { val: item.value / 1000000000000 + " P3D" },
        { val: moment(item.blockDatetime).fromNow() },
      ]);
    }

    return array;
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container">
          <div className="list-header mb10">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Transfers</div>
            </div>
          </div>
          <Table header={headersTable} array={prepareTableArray(transfers)} />
          <Pagination
            pagePrev={pagination.pagePrev}
            pageNext={pagination.pageNext}
            setPageKey={setPageKey}
          />
        </div>
      </div>
    </div>
  );
};

export default Blocks;
