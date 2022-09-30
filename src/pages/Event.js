import React, { useEffect, useState } from "react";

import ListInfo from "../components/ListInfo";
import axiosInstance from "../api/axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const Event = () => {
  const { number } = useParams();
  const [event, setEvent] = useState({});

  useEffect(() => {
    const splitParam = number.split("-");
    const getEvent = async (block, number) => {
      const postEvent = {
        query: `{
            getEvent(filters: {blockNumber: ${block} eventIdx: ${number}})
              {
                eventIdx
                event
                eventName
                eventModule
                extrinsicIdx
                phaseIdx
                phaseName
                complete
                attributes
                topics
                blockDatetime
                blockHash
                specName
                specVersion
              }
          }`,
      };

      const responseEvent = await axiosInstance.post("", postEvent);
      setEvent(responseEvent.data.data.getEvent);
    };

    getEvent(splitParam[0], splitParam[1]);
  }, [number]);

  const {
    blockDatetime,
    blockHash,
    complete,
    eventModule,
    eventName,
    phaseName,
    specName,
    specVersion,
  } = event;

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Event#{number}</div>
            </div>
          </div>
          <ListInfo
            title={"Block Time"}
            info={moment(blockDatetime).fromNow()}
            canCopy={false}
          />
          <ListInfo title={"Block Hash"} info={blockHash} canCopy={true} />
          <ListInfo
            title={"Status"}
            info={complete ? "Finalized" : "Not Finalized"}
            canCopy={false}
          />
          <ListInfo title={"Event Module"} info={eventModule} canCopy={false} />
          <ListInfo title={"Event Name"} info={eventName} canCopy={false} />
          <ListInfo title={"Phase Name"} info={phaseName} canCopy={false} />
          <ListInfo title={"Spec Name"} info={specName} canCopy={false} />
          <ListInfo title={"Spec Version"} info={specVersion} canCopy={false} />
        </div>
      </div>
    </div>
  );
};

export default Event;
