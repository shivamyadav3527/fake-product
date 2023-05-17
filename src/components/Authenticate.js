import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import Webcam from "react-webcam";
import axios from "axios";

import "../css/Authenticate.css";
const Authenticate = ({ account }) => {
  const webcamRef = React.useRef(null);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!auth) {
        setMessage("Product is not Authenticated ❌");
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [auth]);
  
  return (
    <>
      <div className="cam">
        <h4 style={{ color: "#000", position: "fixed", right: 8, top: 2 }}>
          Wallet Address:{" "}
          {account.substring(0, 4) +
            "..." +
            account.substring(account.length - 4, account.length)}
        </h4>
   
        <br />
        <h1 style={{ position: "absolute", top: 15, color:`#ff00ff` }}>
          Hold QR Code Steady and Clear to Scan!!
        </h1>
        
  
        <Webcam
          audio={false}
          ref={webcamRef}
          width={400}
          height={400}
          screenshotFormat="image/jpg"
        />
        
        <QrReader
          onResult={async (result, error) => {
            if (!!result && !!result?.text) {
              let data = JSON.parse(result?.text);
              if (data.hash) {
                let res = await axios.get(
                  `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${data.hash}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
                );
                if (res) {
                  setMessage("Product is Authenticated ✅");
                  setAuth(true);
                }
                else {
                  setMessage("Product is not Authenticated ❌");
                  setAuth(false);
                }
              }
            }
            if (!!error) {
              console.info(error);
             
            }
          }}
          
          style={{ width: "100%" }}
        />
        
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            top: "50%",
          }}
        >
          <div>
            <h1>{message}</h1>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 90 }}>
        <h1>
            Please Wait For 10 Sec If Authentication Messages Is Not Appearing
            On The Screen Then Your Product Is Not Authenticated.
          </h1>
          <br />
          <h2 style={{color:`#8b0000`}}><span><i>*******Please Reload The Page To Scan Again*********</i></span></h2>
        </div>
      </div>
    </>
  );
};

export default Authenticate;
