import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useEffect, useState } from "react";

import ErrorData from "../components/ErrorData";
import ListInfo from "../components/ListInfo";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const Transfer = () => {
  const { number } = useParams();
  const [extrinsic, setExtrinsic] = useState({});
  const [extrinsicInfo, setExtrinsicInfo] = useState({});
  const eventsHeader = [
    "Event ID",
    "Extrinct ID",
    "Event Module",
    "Event Name",
  ];
  const [events, setEvents] = useState([]);
  const [errorData, setErrorData] = useState(false);

  useEffect(() => {
    const wsProvider = new WsProvider("wss://rpc2.3dpass.org");
    const splitParam = number.split("-");

    const getExtrinsic = async (blockNumber, number) => {
      const postData = {
        query: `{
              getExtrinsic(filters: {blockNumber: ${blockNumber} extrinsicIdx: ${number} })
                {
                  blockNumber
                  extrinsicIdx
                  extrinsicLength
                  hash
                  version
                  versionInfo
                  call
                  callModule
                  callName
                  callArguments
                  callHash
                  signed
                  signature
                  signatureVersion
                  multiAddressRaw
                  multiAddressType
                  multiAddressAccountId
                  multiAddressAddress32
                  multiAddressAddress20
                  multiAddressAccountIndex
                  nonce
                  era
                  eraImmortal
                  eraBirth
                  eraDeath
                  tip
                  blockDatetime
                  blockHash
                  specName
                  specVersion
                  complete
                }
              }`,
      };

      const response = await axiosInstance.post("", postData);

      if (response.data.data.getExtrinsic) {
        setExtrinsic(response.data.data.getExtrinsic);

        let eventsArray = [];
        const postEvent = {
          query: `{
          getEvent(filters: {blockNumber: ${blockNumber} eventIdx: ${number}})
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
        setEvents(eventsArray);

        const api = await ApiPromise.create({ provider: wsProvider });
        const blockHash = response.data.data.getExtrinsic.blockHash;
        const { block } = await api.rpc.chain.getBlock(blockHash);
        const extrinctsInfo = JSON.parse(
          JSON.stringify(block.extrinsics[1].toHuman(), null, 2)
        );

        const queryFeeDetails = await api.rpc.payment.queryFeeDetails(
          block.extrinsics[1].toHex(),
          blockHash
        );

        const feedInfo = JSON.parse(
          JSON.stringify(queryFeeDetails.toHuman(), null, 2)
        );

        let baseFee = feedInfo.inclusionFee.baseFee.split(" ")[0];
        let finalBaseFee = Number(baseFee);
        let lenFee = feedInfo.inclusionFee.lenFee
          .split(" ")[0]
          .replaceAll(".", "");
        let finalLenFee = Number(lenFee);
        let convertLen = finalLenFee / 10000000;
        let estimatedFee = finalBaseFee + convertLen;

        const queryInfo = await api.rpc.payment.queryInfo(
          block.extrinsics[1].toHex(),
          blockHash
        );

        const parsedInfo = JSON.parse(
          JSON.stringify(queryInfo.toHuman(), null, 2)
        );

        let value = extrinctsInfo.method.args.value
          ? parseInt(extrinctsInfo.method.args.value)
          : 0;
        let extendValue = value * 1000000000000000;
        let finalValue = extendValue / 1000000000000;

        let object = {
          value: finalValue + " P3D",
          sender: extrinctsInfo.signer.Id,
          destination: extrinctsInfo.method.args.dest
            ? extrinctsInfo.method.args.dest.Id
            : "-",
          partialFee: parsedInfo.partialFee,
          estimatedFee: estimatedFee + " mP3D",
        };

        setExtrinsicInfo(object);
      } else {
        setErrorData(true);
      }
    };

    getExtrinsic(splitParam[0], splitParam[1]);
  }, [number]);

  const prepareTableArray = (arr, type) => {
    if (!arr.length) {
      return [];
    }

    const splitParam = number.split("-");
    let array = [];

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      const indexEvent = splitParam[0] + "-" + i;

      if (type === "events") {
        array.push([
          { val: indexEvent },
          { val: indexEvent },
          { val: item.eventModule },
          { val: item.eventName },
        ]);
      }
    }

    return array;
  };

  const {
    blockDatetime,
    blockNumber,
    hash,
    callModule,
    callName,
    signature,
    complete,
    nonce,
    callArguments,
  } = extrinsic;

  const { value, sender, destination, partialFee, estimatedFee } =
    extrinsicInfo;

  return (
    <div className="page-content">
      <div className="main-inner">
        {!errorData && (
          <>
            <div className="list-container blocks-list-container">
              <div className="list-header">
                <div className="list-header-content">
                  <div className="list-icon transfer-icon"></div>
                  <div className="list-title">Extrinsic#{number}</div>
                </div>
              </div>
              <ListInfo
                title={"Block Time"}
                info={moment(blockDatetime).fromNow()}
                canCopy={false}
              />
              <ListInfo title={"Block"} info={blockNumber} canCopy={false} />
              <ListInfo title={"Extrinsic Hash"} info={hash} canCopy={true} />
              <ListInfo title={"Module"} info={callModule} canCopy={false} />
              <ListInfo title={"Call"} info={callName} canCopy={false} />
              {sender && (
                <ListInfo
                  title={"Sender (from)"}
                  info={sender}
                  canCopy={true}
                />
              )}
              {destination && (
                <ListInfo
                  title={"Destination (to)"}
                  info={destination}
                  canCopy={destination !== "-" ? true : false}
                />
              )}
              {value && (
                <ListInfo title={"Value"} info={value} canCopy={false} />
              )}
              {estimatedFee && (
                <ListInfo
                  title={"Estimated Fee"}
                  info={estimatedFee}
                  canCopy={false}
                />
              )}
              {partialFee && (
                <ListInfo
                  title={"Used Fee"}
                  info={partialFee}
                  canCopy={false}
                />
              )}
              <ListInfo
                title={"Nonce"}
                info={nonce ? nonce : "-"}
                canCopy={false}
              />
              <ListInfo
                title={"Result"}
                info={complete === 1 ? "Finalized" : "Not Finalized"}
                canCopy={false}
              />
              {callArguments && (
                <ListInfo
                  title={"Parameters"}
                  info={JSON.stringify(JSON.parse(callArguments), null, 2)}
                  canCopy={false}
                  isCode={true}
                />
              )}
              <ListInfo
                title={"Signature"}
                info={signature ? signature : "-"}
                canCopy={false}
              />
            </div>
            <div className="list-container blocks-list-container table-container">
              <div className="main-menu">
                <div className="menu-item active">Events ({events.length})</div>
              </div>
              <Table
                header={eventsHeader}
                array={prepareTableArray(events, "events")}
              />
            </div>
          </>
        )}
        {errorData && <ErrorData error={"No available data for Extrinsic"} />}
      </div>
    </div>
  );
};

export default Transfer;
