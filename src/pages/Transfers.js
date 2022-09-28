import React, { useEffect, useState } from "react";

import Pagination from "../components/Pagination";
import TransferPreview from "../components/TransferPreview";
import axiosInstance from "../api/axios";

const Blocks = () => {
  const [transfers, setTransfers] = useState([]);
  const [pageKey, setPageKey] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const getTransfers = async () => {
      const postData = {
        query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 10) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, value, blockDatetime, complete, fromMultiAddressType, fromMultiAddressAccountId, toMultiAddressType, toMultiAddressAccountId}}}`,
      };

      const response = await axiosInstance.post("", postData);
      setTransfers(response.data.data.getTransfers.objects);
      setPagination(response.data.data.getTransfers.pageInfo);
    };
    getTransfers();
  }, [pageKey]);

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Transfers</div>
            </div>
          </div>
          {transfers.map((item, i) => (
            <TransferPreview transfer={item} key={i} />
          ))}
        </div>
        <Pagination
          pagePrev={pagination.pagePrev}
          pageNext={pagination.pageNext}
          setPageKey={setPageKey}
        />
      </div>
    </div>
  );
};

export default Blocks;
