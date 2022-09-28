import React, { useEffect, useState } from "react";

import BlockPreview from "../components/BlockPreview";
import Pagination from "../components/Pagination";
import axiosInstance from "../api/axios";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [pageKey, setPageKey] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const getBlocks = async () => {
      const postData = {
        query: `query{getBlocks(pageKey: "${pageKey}", pageSize: 20){pageInfo{pageSize, pageNext, pagePrev}, objects{number, parentNumber, parentHash, stateRoot, hash, datetime, totalWeight, countExtrinsics, countEvents, countLogs, specName}}}`,
      };

      const response = await axiosInstance.post("", postData);
      setBlocks(response.data.data.getBlocks.objects);
      setPagination(response.data.data.getBlocks.pageInfo);
    };
    getBlocks();
  }, [pageKey]);

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon cube-icon"></div>
              <div className="list-title">Blocks</div>
            </div>
          </div>
          {blocks.map((item, i) => (
            <BlockPreview block={item} key={i} />
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
