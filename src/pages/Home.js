import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useEffect, useState } from "react";
import { Keyring } from "@polkadot/keyring";
import { u8aToHex } from "@polkadot/util";

import BlockPreview from "../components/BlockPreview";
import { Link } from "react-router-dom";
import TransferPreview from "../components/TransferPreview";
import axiosInstance from "../api/axios";

fetch('https://prod-api.3dpass.org:4000/validators')
  .then(response => response.json())
  .then(data => {
    const totalvalidators = data.totalOnlineValidators;
    if (totalvalidators) {
      document.getElementById("onlinevalidator").textContent = totalvalidators;
    } else {
      document.getElementById("onlinevalidator").textContent = 'Loading...';
    }
  })
  .catch(error => console.error(error));


fetch('https://prod-api.3dpass.org:4000/transfercount')
  .then(response => response.json())
  .then(data => {
    const totalTransfers = data.totalTransfers;
    if (totalTransfers) {
      document.getElementById("totaltransfer").textContent = totalTransfers;
    } else {
      document.getElementById("totaltransfer").textContent = 'Loading...';
    }
  })
  .catch(error => console.error(error));

fetch('https://prod-api.3dpass.org:4000/signedExtrinsicCount')
  .then(response => response.json())
  .then(data => {
    const totalSignedExtrinsics = data.totalSignedExtrinsics;
    if (totalSignedExtrinsics) {
      document.getElementById("totalsignedex").textContent = totalSignedExtrinsics;
    } else {
      document.getElementById("totalsignedex").textContent = 'Loading...';
    }
  })
  .catch(error => console.error(error));

fetch('https://prod-api.3dpass.org:4000/topholdercnt')
  .then(response => response.json())
  .then(data => {
    const count = data.count;
    if (count) {
      document.getElementById("tholdcnt").textContent = count;
    } else {
      document.getElementById("tholdcnt").textContent = 'Loading...';
    }
  })
  .catch(error => console.error(error));


fetch('https://explorer.3dpass.org/response.json')
  .then(response => response.json())
  .then(data => {
    const lastPrice = data.last_price;
    if (lastPrice) {
      const formattedPrice = lastPrice + ' $';
      document.getElementById("price").textContent = formattedPrice;
    } else {
      document.getElementById("price").textContent = '--$';
    }
  })
  .catch(error => console.error(error));



fetch('https://wallet.3dpass.org/network')
  .then(response => response.json())
  .then(data => {
    const circulatingSupply = data.circulatingSupply / 1e12;
    const totalSupply = data.totalSupply / 1e12;

    const circulatingSupplyElem = document.querySelector('#circulatingSupply');
    const totalSupplyElem = document.querySelector('#totalSupply');
	let supplyValue = totalSupply;
	let extensiont = "P3D";

	if (supplyValue >= 1000) {
	  supplyValue /= 1000;
	  extensiont = "KP3D";
	}

	if (supplyValue >= 1000) {
	  supplyValue /= 1000;
	  extensiont = "MP3D";
	}

	if (supplyValue >= 1000) {
	  supplyValue /= 1000;
	  extensiont = "BP3D";
	}

	totalSupplyElem.innerHTML = `${supplyValue.toFixed(4)} ${extensiont}`;
	let circValue = circulatingSupply;
	let extension = "P3D";

	if (circValue >= 1000) {
	  circValue /= 1000;
	  extension = "KP3D";
	}
	
	if (circValue >= 1000) {
	  circValue /= 1000;
	  extension = "MP3D";
	}
	
	if (circValue >= 1000) {
	  circValue /= 1000;
	  extension = "BP3D";
	}

	circulatingSupplyElem.innerHTML = `${circValue.toFixed(3)} ${extension}`;
  })
  .catch(error => console.log(error));

  const Home = () => {
  const [blocks, setBlocks] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [latestBlock, setLatestBlock] = useState(0);
  const [totalInsurance, setTotalInsurance] = useState("-");
  
  
  useEffect(() => {
    getBlocks();
    getTransfers();
    getInfo();
  }, []);

  

const getBlocks = async () => {
    const postData = {
      query: `{getBlocks(pageKey: "1", pageSize: 10){pageInfo{pageSize, pageNext, pagePrev}, objects{number, parentNumber, parentHash, stateRoot, hash, datetime, totalWeight, countExtrinsics, countEvents, countLogs, specName}}}`,
    };

    const response = await axiosInstance.post("", postData);
    setBlocks(response.data.data.getBlocks.objects);
    setLatestBlock(response.data.data.getBlocks.objects[0].number);
  };

  const getTransfers = async () => {
    const postData = {
      query: `{getTransfers(pageKey: "1", pageSize: 10) {pageInfo{pageSize, pageNext, pagePrev}, objects{blockNumber, eventIdx, extrinsicIdx, value, blockDatetime, complete, fromMultiAddressType, fromMultiAddressAccountId, toMultiAddressType, toMultiAddressAccountId}}}`,
    };

    const response = await axiosInstance.post("", postData);
    setTransfers(response.data.data.getTransfers.objects);
  };

  const getInfo = async () => {
    const wsProvider = new WsProvider("wss://rpc2.3dpass.org");
    const api = await ApiPromise.create({ provider: wsProvider });
    const lol = await api.query.balances.totalIssuance();
    const lolNumber = lol.toHuman().replaceAll(",", "");

    const dividedLol = Number(lolNumber) / 1000000000000;
    const totalInsuranceVal = dividedLol / 1000000;

    setTotalInsurance(totalInsuranceVal.toFixed(4));
  };

  return (
    <div className="page-content">
      <div className="main-inner">
        <div className="list-container home-info-container">
          <div className="home-info">
            <div className="home-info-icon cube-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Latest Block</div>
              <div className="home-info-value">{latestBlock}</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon note-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Signed Extrinsic</div>
              <div id="totalsignedex" className="home-info-value"></div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon transfer-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Transfers</div>
              <div id="totaltransfer" className="home-info-value"></div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon user-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Holders</div>
              <div id="tholdcnt" className="home-info-value"></div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon graph-home-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Total Issuance</div>
              <div className="home-info-value">{totalInsurance} MP3D</div>
            </div>
          </div>
	   <div className="home-info">
            <div className="home-info-icon graph-home-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">circulatingSupply</div>
              <div id="circulatingSupply" className="home-info-value">-- MP3D</div>
            </div>
	    </div>
	  <div className="home-info">
            <div className="home-info-icon graph-home-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Online validators</div>
              <div id="onlinevalidator" className="home-info-value"></div>
            </div>
          </div>
	  <div className="home-info">
            <div className="home-info-icon graph-home-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Max supply</div>
              <div id="totalSupply" className="home-info-value">MP3D</div>
            </div>
          </div>
          <div className="home-info">
            <div className="home-info-icon coin-icon"></div>
            <div className="home-info-content">
              <div className="home-info-title">Current Price</div>
              <div id="price" className="home-info-value"></div>
            </div>
          </div>
        </div>
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon cube-icon"></div>
              <div className="list-title">Blocks</div>
            </div>
            <Link to="/blocks/1">
              <div className="main-btn">View All</div>
            </Link>
          </div>
          {blocks.map((item, i) => (
            <BlockPreview block={item} key={i} />
          ))}
        </div>
        <div className="list-container home-list-container">
          <div className="list-header">
            <div className="list-header-content">
              <div className="list-icon transfer-icon"></div>
              <div className="list-title">Transfers</div>
            </div>
            <Link to="/transfers/1">
              <div className="main-btn">View All</div>
            </Link>
          </div>
	   {transfers.map((item, i) => (
            <TransferPreview transfer={item} key={i} />
          ))}
        </div>
      </div>
    </div>
  );

};
export default Home;
