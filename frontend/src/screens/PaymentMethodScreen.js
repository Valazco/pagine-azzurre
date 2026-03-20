import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { savePaymentMethod } from "../actions/cartActions";
import { payVals } from "../actions/paymentActions";
import CheckoutSteps from "../components/CheckoutSteps";
import MessageBox from "../components/MessageBox";
// Variable never used.
//import { ReactComponent as DinastyIco } from "../resources/logos/cropped-cropped-Logo.svg";

import Web3 from "web3";
import SContract from "../web3Interface/abi.js";
import Axios from "axios";

export default function PaymentMethodScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  // variables never used.
  //const userDetails = useSelector((state) => state.userDetails);
  //const { loading, error, user } = userDetails;
  const cart = useSelector((state) => state.cart);
  const [phase, setPhase] = useState(1);
  const [balance, setBalance] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3Config, setWeb3Config] = useState(null);
  const { cartItems, shippingAddress } = cart;

  async function getSetBalance(account) {
    if (!contract) return;
    try {
      let balance = await contract.methods.balanceOf(account).call();
      balance = parseFloat(balance) / 100;
      setBalance(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  }

  if (!shippingAddress.address) {
    props.history.push("/shipping");
  }
  const [paymentMethod, setPaymentMethod] = useState("Concordato");
  const dispatch = useDispatch();
  const changePhase = () => {
    setPhase(2);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    dispatch(payVals(userInfo.account, cartItems));
    props.history.push("/placeorder");
  };
  // Fetch Web3 configuration from backend
  useEffect(() => {
    const fetchWeb3Config = async () => {
      try {
        const { data } = await Axios.get("/api/config/web3");
        setWeb3Config(data);
      } catch (error) {
        console.error("Error fetching Web3 config:", error);
      }
    };
    fetchWeb3Config();
  }, []);

  // Initialize Web3 and contract when config is loaded
  useEffect(() => {
    if (web3Config && web3Config.infuraUrl) {
      try {
        const web3Instance = new Web3(web3Config.infuraUrl);
        const deployedNetwork = SContract.networks[web3Config.networkId];
        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            SContract.abi,
            deployedNetwork.address
          );
          setWeb3(web3Instance);
          setContract(contractInstance);
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    }
  }, [web3Config]);

  // Get balance when contract is ready
  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract && userInfo.account) {
      getSetBalance(userInfo.account);
    }
  }, [contract, userInfo.account]);
  return (
    <div className="flash">
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      {phase === 1 && (
        <form className="form" onSubmit={changePhase}>
          <div className="row center">
            <h1>Metodo di Pagamento</h1>
            <p>
              Il metodo di pagamento deve essere concordato direttamente con
              l'offerente
            </p>
          </div>
          {/* <div>
            <div>
              <input
                type="radio"
                id="paypal"
                value="PayPal"
                name="paymentMethod"
                required
                checked
                disabled
                onChange={ (e) => setPaymentMethod(e.target.value) }
              ></input>
              <label htmlFor="paypal">PayPal (attualmente Inattivo dal sito)</label>
            </div>
          </div> */}
          <div className="select-payment">
            <select onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Stripe">Val ☯️</option>
              <option value="Stripe">Euro (attualmente inattivo)</option>
              <option value="Stripe">
                Monete speculative (attualmente inattivo)
              </option>
              <option value="Stripe">Dinastycoin</option>
            </select>
          </div>
          {/* <div>
            <div className="flex-container">
              <input
                type="radio"
                id="stripe"
                value="Stripe"
                name="paymentMethod"
                required
                disabled
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></input>
              <label htmlFor="stripe">Euro € (attualmente inattivo)</label>
            </div>
          </div>
          <div>
            <div className="flex-container">
              <input
                type="radio"
                id="stripe"
                value="Stripe"
                name="paymentMethod"
                required
                disabled
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></input>
              <label htmlFor="stripe">Monete speculative (attualmente inattivo)</label>
            </div>
          </div>
          <div>
            <div className="flex-container">
              <input
                type="radio"
                id="stripe"
                value="Stripe"
                name="paymentMethod"
                checked={true}
                required
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></input>
              <label htmlFor="stripe">Val ☯️</label>
            </div>
          </div> */}
          <div>
            <label />
            <button className="primary blu" type="submit">
              Prosegui
            </button>
            {!userInfo.hasAd && (
              <MessageBox variant="alert">
                Ricordati che per poter entrare in contatto con un offerente
                devi prima mettere un prodotto in vetrina.{" "}
                <Link to="/productlist/seller">Crea l'annuncio addeso</Link>
              </MessageBox>
            )}
          </div>
        </form>
      )}
      {phase === 2 && (
        <div>
          <form className="form" onSubmit={submitHandler}>
            <div className="row center">
              <h1>Paga addesso i Val richieste in questo scambio</h1>
              <p>
                Attualmente hai <strong>{balance}</strong> Vals nel tuo
                portafoglio delle pagineazzurre
              </p>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <label />
              <button className="primary blu" type="submit">
                <p style={{ fontSize: "1.85rem" }}>
                  Trasferisci la quantità di{" "}
                  <strong>
                    {cartItems.reduce((a, c) => a + c.priceVal * c.qty, 0)}
                  </strong>{" "}
                  Val all'offerente
                </p>
              </button>
              {!userInfo.hasAd && (
                <MessageBox variant="alert">
                  Ricordati che per poter entrare in contatto con un offerente
                  devi prima mettere un prodotto in vetrina.{" "}
                  <Link to="/productlist/seller">Crea l'annuncio addeso</Link>
                </MessageBox>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
