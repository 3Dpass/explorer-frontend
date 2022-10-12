import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainInput from "../components/MainInput";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import axiosInstance from "../api/axios";
import moment from "moment";
import { toast } from "react-toastify";

const Events = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [pageKey, setPageKey] = useState(null);
  const [pagination, setPagination] = useState({});
  const headersTable = [
    "Block",
    "Event Id",
    "Event Module",
    "Event Name",
    "Time",
  ];
  const [blockNumber, setBlockNumber] = useState("");
  const [eventModule, setEventModule] = useState("");
  const [eventName, setEventName] = useState("");
  const [filters, setFiltersString] = useState(``);

  useEffect(() => {
    setPageKey(page);
  }, [page, pageKey]);

  useEffect(() => {
    if (pageKey) {
      const getEvents = async () => {
        const postData = {
          query: `query{getEvents(pageKey: "${pageKey}", pageSize: 12, ${filters}) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, blockDatetime, event, eventModule, eventName}}}`,
        };

        const response = await axiosInstance.post("", postData);
        setEvents(response.data.data.getEvents.objects);
        setPagination(response.data.data.getEvents.pageInfo);
      };

      getEvents();
    }
  }, [pageKey, filters]);

  const setFilters = () => {
    let blockNumberFilter = ``;
    let eventModuleFilter = ``;
    let eventNameFilter = ``;

    if (blockNumber !== "") {
      blockNumberFilter = `blockNumber: ${blockNumber}`;
    }

    if (eventModule !== "") {
      eventModuleFilter = `eventModule: "${eventModule}"`;
    }

    if (eventName !== "") {
      eventNameFilter = `eventName: "${eventName}"`;
    }

    if (eventName !== "" && eventModule === "") {
      eventNameFilter = ``;
      toast(
        "If you want to use Event Name as filter you also must include Event Module."
      );
    }

    let filters = `filters: {${blockNumberFilter} ${eventModuleFilter} ${eventNameFilter}}`;
    setPageKey(1);
    setFiltersString(filters);
  };

  const prepareTableArray = (arr) => {
    if (!arr.length) {
      return [];
    }

    let array = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      array.push([
        {
          val: item.blockNumber,
          url: "/block/" + item.blockNumber,
        },
        {
          val: item.blockNumber + "-" + item.eventIdx,
          url: "/event/" + item.blockNumber + "-" + item.eventIdx,
        },
        { val: item.eventModule },
        { val: item.eventName },
        { val: moment(item.blockDatetime).fromNow() },
      ]);
    }

    return array;
  };

  const updatePage = (page) => {
    navigate("/events/" + page.toString());
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container blocks-list-container mb10">
          <div className="list-header mb10">
            <div className="list-header-content">
              <div className="list-icon filter-icon"></div>
              <div className="list-title">Filters</div>
            </div>
            <div className="main-btn" onClick={() => setFilters()}>
              Filter
            </div>
          </div>
          <div className="filters-content">
            <MainInput
              placeholder={"Block Number"}
              type="number"
              value={blockNumber}
              onChange={setBlockNumber}
            />
            <MainInput
              placeholder={"Event Module"}
              type="text"
              value={eventModule}
              onChange={setEventModule}
            />
            <MainInput
              placeholder={"Event Name"}
              type="text"
              value={eventName}
              onChange={setEventName}
            />
          </div>
        </div>
        <div className="list-container blocks-list-container">
          <div className="list-header mb10">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Events</div>
            </div>
          </div>
          <Table header={headersTable} array={prepareTableArray(events)} />
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

export default Events;
