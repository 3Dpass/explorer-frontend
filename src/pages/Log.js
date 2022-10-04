import React, { useEffect, useState } from "react";

import ListInfo from "../components/ListInfo";
import axiosInstance from "../api/axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const Log = () => {
  const { number } = useParams();
  const [log, setLog] = useState({});

  useEffect(() => {
    const splitParam = number.split("-");
    const getLog = async (block, number) => {
      const postLog = {
        query: `{
        getLog(
            filters:
            {blockNumber: ${block} logIdx: ${number}}
          ){
            data  
            blockNumber
            typeName
            blockDatetime
            typeId
            specName
            specVersion
            complete    
          }
        }`,
      };

      const responseLog = await axiosInstance.post("", postLog);
      setLog(responseLog.data.data.getLog);
    };

    getLog(splitParam[0], splitParam[1]);
  }, [number]);

  const {
    blockNumber,
    blockDatetime,
    complete,
    specName,
    specVersion,
    typeName,
  } = log;

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Log#{number}</div>
            </div>
          </div>
          <ListInfo
            title={"Block"}
            info={blockNumber}
            canCopy={false}
            url={"/block/" + blockNumber}
          />
          <ListInfo
            title={"Block Time"}
            info={moment(blockDatetime).fromNow()}
            canCopy={false}
          />
          <ListInfo
            title={"Status"}
            info={complete ? "Success" : "Not Success"}
            canCopy={false}
          />
          <ListInfo title={"Spec Name"} info={specName} canCopy={false} />
          <ListInfo title={"Spec Version"} info={specVersion} canCopy={false} />
          <ListInfo title={"Type Name"} info={typeName} canCopy={false} />
        </div>
      </div>
    </div>
  );
};

export default Log;
