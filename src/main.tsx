import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./context/store/index.ts";

const stripePromise = loadStripe("pk_test_51QfeEiJPjkyacDG1OLhLDqppvm1eMOROsU1daEGZkPnMKEGdNirwh4dSIxDE5v70EEhPo0Hhf2DoaHnkM9uMaWKm00g3E9yAFi");


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
    <Provider store={store}>
      <Router>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Flip}
        />
      </Router>
    </Provider>
    </Elements>
  </React.StrictMode>
);
