import { Keyring } from '@polkadot/keyring';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Pagination from "../components/Pagination";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import moment from "moment";

const Blocks = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState([]);
  const [pageKey, setPageKey] = useState(null);
  const [pagination, setPagination] = useState({});
  const headersTable = [
    "Extrinsic",
    "Block",
    "From",
    "To",
    "Value",
    "Status",
    "Time",
  ];

  useEffect(() => {
    setPageKey(page);
  }, [page, pageKey]);

  useEffect(() => {
    if (pageKey) {
      const getTransfers = async () => {
        const postData = {
          query: `query{getTransfers(pageKey: "${pageKey}", pageSize: 12) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, value, blockDatetime, complete, fromMultiAddressType, fromMultiAddressAccountId, toMultiAddressType, toMultiAddressAccountId}}}`,
        };

        const response = await axiosInstance.post("", postData);
        setTransfers(response.data.data.getTransfers.objects);
        setPagination(response.data.data.getTransfers.pageInfo);
      };
      getTransfers();
    }
  }, [pageKey]);
  const keyring = new Keyring();
  const prepareTableArray = (arr) => {
    if (!arr.length) {
      return [];
    }

    let array = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let fromEncoded = keyring.encodeAddress(item.fromMultiAddressAccountId, 71);
      let toEncoded = keyring.encodeAddress(item.toMultiAddressAccountId, 71);
      array.push([
        {
          val: item.blockNumber + "-" + item.extrinsicIdx,
          url: "/extrinsic/" + item.blockNumber + "-" + item.extrinsicIdx,
        },
        {
          val: item.blockNumber,
          url: "/block/" + item.blockNumber,
        },
        {
	  val: fromEncoded,
          url: "/account/" + fromEncoded,
        },
        {
	  val: toEncoded,
          url: "/account/" + toEncoded,
        },
        { val: item.value / 1000000000000 + " P3D" },
        { val: item.complete ? "Success" : "Not Success" },
        { val: moment(item.blockDatetime).fromNow() },
      ]);
    }

    return array;
  };

  const updatePage = (page) => {
    navigate("/transfers/" + page.toString());
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
            setPageKey={updatePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Blocks;
