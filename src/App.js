import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Account from "./pages/Account";
import Block from "./pages/Block";
import Blocks from "./pages/Blocks";
import Event from "./pages/Event";
import Header from "./components/Header";
import Home from "./pages/Home";
import Log from "./pages/Log";
import { ToastContainer } from "react-toastify";
import Transfer from "./pages/Transfer";
import Transfers from "./pages/Transfers";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/block/:number" element={<Block />} />
        <Route path="/extrinsic/:number/:eventId" element={<Transfer />} />
        <Route path="/log/:number" element={<Log />} />
        <Route path="/event/:number" element={<Event />} />
        <Route path="/account/:account" element={<Account />} />
      </Routes>
      <ToastContainer
        position="top-right"
        hideProgressBar={true}
        type="info"
        autoClose={2500}
      />
    </BrowserRouter>
  );
};

export default App;
