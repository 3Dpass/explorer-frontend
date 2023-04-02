import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Account from "./pages/Account";
import Block from "./pages/Block";
import Blocks from "./pages/Blocks";
import Event from "./pages/Event";
import Events from "./pages/Events";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Log from "./pages/Log";
import { ToastContainer } from "react-toastify";
import Transfer from "./pages/Transfer";
import Transfers from "./pages/Transfers";
import TopHolder from "./pages/TopHolder";
import TagSearchResults from "./pages/Tags";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks/:page" element={<Blocks />} />
        <Route path="/transfers/:page" element={<Transfers />} />
        <Route path="/tag/:search" element={<TagSearchResults />} />
        <Route path="/block/:number" element={<Block />} />
        <Route path="/extrinsic/:number" element={<Transfer />} />
        <Route path="/log/:number" element={<Log />} />
        <Route path="/event/:number" element={<Event />} />
        <Route path="/account/:account" element={<Account />} />
        <Route path="/events/:page" element={<Events />} />
	      <Route path="/top-holder" element={<TopHolder />} />
      </Routes>

      <ToastContainer
        position="top-right"
        hideProgressBar={true}
        type="info"
        autoClose={2500}
      />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
