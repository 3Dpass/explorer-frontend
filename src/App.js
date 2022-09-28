import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Block from "./pages/Block";
import Blocks from "./pages/Blocks";
import Header from "./components/Header";
import Home from "./pages/Home";
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
        <Route path="/extrinsic/:number" element={<Transfer />} />
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
