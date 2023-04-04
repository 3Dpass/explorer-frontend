import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlockComponent from "../components/RenderBlock";
import { RPC_CONFIG, RPC_TYPES } from "../components/RpcConf";
import { Buffer } from "buffer";

import ErrorData from "../components/ErrorData";
import { Keyring } from "@polkadot/keyring";
import ListInfo from "../components/ListInfo";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import classNames from "classnames";
import moment from "moment";

const Block = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const [block, setBlock] = useState({});
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [extrincts, setExtrincts] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Extrinsics");
  const [authorId, setAuthorId] = useState("");
  const [miner, setMiner] = useState("");
  const [object3d, setObject3D] = useState("");
  const [objectAlgo, setObjectAlgo] = useState("");
  const [objectHashes, setObjectHashes] = useState([]);
  const [errorData, setErrorData] = useState(false);
  const [validator, setValidator] = useState("");
  const logsHeaders = ["Log Index", "Block", "Type"];
  const eventsHeader = ["Event ID", "Event Module", "Event Name"];
  const extrinctsHeaders = ["Extrinsic ID", "Hash", "Completed"];

  useEffect(() => {
    const getBlock = async (number) => {
      const postData = {
        query: `{
          getBlock(filters: {number: ${number} } 
          )
          {
            datetime
            complete
            hash
            parentHash
            stateRoot
            extrinsicsRoot
            specVersion
            countLogs,
            countEvents,
            countExtrinsics,
          }
        }`,
      };

      const response = await axiosInstance.post("", postData);
      if (response.data.data && response.data.data.getBlock) {
        setErrorData(false);
        setBlock(response.data.data.getBlock);

        const wsProvider = new WsProvider("wss://rpc2.3dpass.org");
        const api = await ApiPromise.create({
          provider: wsProvider,
          types: RPC_TYPES,
          rpc: RPC_CONFIG,
        });
        const simo = await api.query.validatorSet.authors(number);
        const blockHash = await api.rpc.chain.getBlockHash(number);
        const blockHeader = await api.rpc.chain.getHeader(blockHash);
        const algoNameLength = 32;
        const objectHashLength = 64;
        const objectHashesString = blockHeader.digest.logs[2].asOther
          .toString()
          .substring(2);
        const objectHashAlgo = objectHashesString.substring(0, algoNameLength);
        const objectAlgo = Buffer.from(objectHashAlgo, "hex").toString("utf8");
        const objectObjRaw = await api.rpc.poscan.getMiningObject(blockHash);
        const objectObj = objectObjRaw.toString();
        const objectHashes = [];
        let offset = algoNameLength;
        while (offset < objectHashesString.length) {
          objectHashes.push(
            objectHashesString.substring(offset, offset + objectHashLength)
          );
          offset += objectHashLength;
        }
        setObjectHashes(objectHashes);
        
        setObjectAlgo(objectAlgo);
        setValidator(simo.toHuman());
        setObject3D(objectObj);
        let extrinctArray = [];
        const countExtrinsics = response.data.data.getBlock.countExtrinsics;

        for (let j = 0; j < countExtrinsics; j++) {
          const postEXtrinct = {
            query: `{
            getExtrinsic(filters: {blockNumber: ${number} extrinsicIdx: ${j}})
              {
                hash
                complete
              }
            }`,
          };

          const responseExtrincts = await axiosInstance.post("", postEXtrinct);
          extrinctArray.push(responseExtrincts.data.data.getExtrinsic);
          if (j === countExtrinsics - 1) {
            setExtrincts(extrinctArray);
          }
        }

        let eventsArray = [];
        const countEvents = response.data.data.getBlock.countEvents;

        for (let y = 0; y < countEvents; y++) {
          const postEvent = {
            query: `{
            getEvent(filters: {blockNumber: ${number} eventIdx: ${y}})
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
          eventsArray.push(responseEvent.data.data.getEvent);
          if (y === countEvents - 1) {
            setEvents(eventsArray);
          }
        }

        let logsArray = [];
        const countLogs = response.data.data.getBlock.countLogs;

        for (let i = 0; i < countLogs; i++) {
          const postLog = {
            query: `{
            getLog(
              filters:
              {blockNumber: ${number} logIdx: ${i}}
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
          logsArray.push(responseLog.data.data.getLog);

          if (i === 0) {
            let data = JSON.parse(responseLog.data.data.getLog.data);
            let dataType = data[responseLog.data.data.getLog.typeName];
            const keyring = new Keyring();
            const miner = keyring.encodeAddress(dataType[1], 71);

            setMiner(miner);
            setAuthorId(dataType[1]);
          }

          if (i === countLogs - 1) {
            setLogs(logsArray);
          }
        }
      } else {
        setErrorData(true);
      }
    };

    getBlock(number);
  }, [number]);

  const prepareTableArray = (arr, type) => {
    if (!arr.length) {
      return [];
    }

    let array = [];

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      const indexEvent = number + "-" + i;

      if (type === "logs") {
        array.push([
          { val: indexEvent, url: "/log/" + indexEvent },
          { val: item.blockNumber, url: "/block/" + item.blockNumber },
          { val: item.typeName },
        ]);
      }

      if (type === "events") {
        array.push([
          { val: indexEvent, url: "/event/" + indexEvent },
          { val: item.eventModule },
          { val: item.eventName },
        ]);
      }

      if (type === "extrincts") {
        array.push([
          { val: indexEvent, url: "/extrinsic/" + indexEvent },
          { val: item.hash },
          { val: item.complete === 1 ? "Success" : "Not Success" },
        ]);
      }
    }

    return array;
  };

  const changePage = (type) => {
    let numberURL = parseInt(number);
    if (type === "previous") {
      numberURL--;
    } else {
      numberURL++;
    }

    navigate("/block/" + numberURL);
  };

  const {
    datetime,
    complete,
    hash,
    parentHash,
    stateRoot,
    extrinsicsRoot,
    specVersion,
    countExtrinsics,
    countEvents,
    countLogs,
  } = block;

  return (
    <div className="page-content">
      <div className="main-inner">
        {!errorData && (
          <>
            <div className="list-container blocks-list-container">
              <div className="list-header">
                <div className="list-header-content">
                  <div className="list-icon cube-icon"></div>
                  <div className="list-title">Block#{number}</div>
                </div>
                <div
                  className="button-pagination previous-icon first-btn"
                  title="Previous Block"
                  onClick={() => changePage("previous")}
                ></div>
                <div
                  className="button-pagination next-icon"
                  title="Next Block"
                  onClick={() => changePage("next")}
                ></div>
              </div>
              <ListInfo title={"Timestamp"} info={datetime} canCopy={false} />
              <ListInfo
                title={"Block Time"}
                info={moment(datetime).fromNow()}
                canCopy={false}
              />
              <ListInfo
                title={"Status"}
                info={complete === 1 ? "Success" : "Not Success"}
                canCopy={false}
              />
              {validator !== "" && (
                <ListInfo title={"Validator"} info={validator} canCopy={true} />
              )}
              <ListInfo title={"Hash"} info={hash} canCopy={true} />
              <ListInfo
                title={"Parent Hash"}
                info={parentHash}
                canCopy={false}
              />
              <ListInfo title={"State Root"} info={stateRoot} canCopy={false} />
              {authorId !== "" && (
                <ListInfo
                  title={"Author Id"}
                  info={authorId}
                  canCopy={true}
                  url={"/account/" + authorId}
                />
              )}
              {miner !== "" && (
                <ListInfo title={"Miner"} info={miner} canCopy={true} />
              )}
              <ListInfo
                title={"Extrinsics Root"}
                info={extrinsicsRoot}
                canCopy={false}
              />
              <ListInfo
                title={"Spec Version"}
                info={specVersion}
                canCopy={false}
              />
              <ListInfo
                title={"Object Hash Algo"}
                info={objectAlgo}
                canCopy={false}
              />
              <ListInfo
                title={"Object unique HashId"}
                info={objectHashes.join("")}
                canCopy={true}
              />
              {object3d && (
                <div className="object-container">
                  <BlockComponent object3d={object3d} />
                </div>
              )}
            </div>
            <div className="list-container blocks-list-container table-container">
              <div className="main-menu">
                <div
                  className={classNames({
                    "menu-item": true,
                    active: activeMenu === "Extrinsics",
                  })}
                  onClick={() => setActiveMenu("Extrinsics")}
                >
                  Extrinsics ({countExtrinsics})
                </div>
                <div
                  className={classNames({
                    "menu-item": true,
                    active: activeMenu === "Events",
                  })}
                  onClick={() => setActiveMenu("Events")}
                >
                  Events ({countEvents})
                </div>
                <div
                  className={classNames({
                    "menu-item": true,
                    active: activeMenu === "Logs",
                  })}
                  onClick={() => setActiveMenu("Logs")}
                >
                  Logs ({countLogs})
                </div>
              </div>
              {activeMenu === "Extrinsics" && (
                <Table
                  header={extrinctsHeaders}
                  array={prepareTableArray(extrincts, "extrincts")}
                />
              )}
              {activeMenu === "Events" && (
                <Table
                  header={eventsHeader}
                  array={prepareTableArray(events, "events")}
                />
              )}
              {activeMenu === "Logs" && (
                <Table
                  header={logsHeaders}
                  array={prepareTableArray(logs, "logs")}
                />
              )}
            </div>
          </>
        )}
        {errorData && (
          <ErrorData error={"No available data for Block #" + number} />
        )}
      </div>
    </div>
  );
};

export default Block;
