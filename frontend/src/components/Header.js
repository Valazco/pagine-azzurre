import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route } from "react-router-dom";

import { signout } from "./../actions/userActions";

import SearchBox from "./../components/SearchBox";

import logo1 from "./../resources/logos/magic_hands.jpg";
import logo2 from "./../resources/logos/bannerarancione.jpg";
import logo3 from "./../resources/logos/yinyang.jpg";
import logo4 from "./../resources/logos/bannerblu.jpg";
import logo5 from "./../resources/logos/bannergiallo.jpg";

import PreHeader from "./PreHeader";
import PostHeader from "./PostHeader";

import {ReactComponent as CartSVG} from "./../resources/cart.svg"

export default function Header({ setSidebarIsOpen }) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <>
      <div className="blubar"></div>
      <PreHeader />
      {/* <div className="pre-header">
        <div className="marquee">
          <p>
            CHOCOSFERA DEL VAL - UN PROGETTO FATTO CON{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            DAL TEAM VALAZCO - CHOCOSFERA DEL VAL.AZ.CO. - VALorizzatore del
            AZione COncordata -
          </p>
        </div>
      </div> */}
      <header className="row">
        <div>
          <button
            type="button"
            className="open-sidebar"
            onClick={() => setSidebarIsOpen(true)}
          >
            <i className="fa fa-bars"></i>
          </button>
          <Link className="brand" to="/">
            Pagine Azzurre
          </Link>
        </div>
        <div>
          <img className="Logo1 logo" src={logo1} alt="Logo" />
        </div>
        <div>
          <img className="Logo2 logo" src={logo2} alt="Logo" />
        </div>
        <div>
          <img className="Logo3 logo" src={logo3} alt="Logo" />
        </div>
        <div>
          <img className="Logo4 logo" src={logo4} alt="Logo" />
        </div>
        <div>
          <img className="Logo5 logo" src={logo5} alt="Logo" />
        </div>
        <div>
          <Route
            render={({ history }) => <SearchBox history={history}></SearchBox>}
          ></Route>
        </div>
        <div>
          <Link to="/tutti_noi">Tutti Noi</Link>
        </div>
        {userInfo ? (
          <div>
            <Link to="/cart" className="cart-container">
              {/* <span role="img" className="carrellino" aria-label="carrello">
                🤝
              </span> */}
              <CartSVG className="cart-icon" />
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
          </div>
        ) : (
          ""
        )}
        {userInfo ? (
          ""
        ) : (
          <div>
            <Link to="/register">Registrati</Link>
          </div>
        )}
        {userInfo ? (
          <div className="dropdown last-element">
            <Link to="#">
              {userInfo.username} <i className="fa fa-caret-down"></i>{" "}
            </Link>
            <ul className="dropdown-content">
              <li>
                <Link to="/profile">Profilo</Link>
              </li>
              {userInfo && userInfo.verified && userInfo.isSeller && (
                <>
                  <li>
                    <Link to="/productlist/seller">Crea Annuncio</Link>
                  </li>
                  <li>
                    <Link to="/productlist/seller">Modifica Annuncio</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Ordini</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Istoriale</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="#signout" onClick={signoutHandler}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="last-element">
            <Link to="/signin">Accedi</Link>
          </div>
        )}
        {userInfo && userInfo.isAdmin && (
          <div className="dropdown">
            <Link to="#admin">
              Admin <i className="fa fa-caret-down"></i>
            </Link>
            <ul className="dropdown-content admin">
              <li>
                <Link to="/dashboard">Pannello di controllo</Link>
              </li>
              <li>
                <Link to="/productlist">Prodotti</Link>
              </li>
              <li>
                <Link to="/orderlist">Ordini</Link>
              </li>
              <li>
                <Link to="/userlist">Utenti</Link>
              </li>
            </ul>
          </div>
        )}
      </header>
      <PostHeader />
      {/* <div className="post-header row center">
        Iscriviti qui:{" "}
        {
          <a className="val_link" href="https://valazco.it">
            valazco.it
          </a>
        }{" "}
        per avere i VAL contributo di esistenza giornaliero da utilizzare subito
      </div> */}
    </>
  );
}
