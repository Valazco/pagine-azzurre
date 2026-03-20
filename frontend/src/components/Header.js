import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route } from "react-router-dom";

import { signout } from "./../actions/userActions";

import SearchBox from "./../components/SearchBox";

import PreHeader from "./PreHeader";
import PostHeader from "./PostHeader";

import { ReactComponent as CartSVG } from "./../resources/cart-icon.svg";

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
        <div className="header-nav">
          <div className="brand-container">
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
          <div className="searchbox-container">
            <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}
            ></Route>
          </div>
        </div>
        <div className="header-actions">
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
                  <Link to="/profile">Personale</Link>
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
                      <Link to="/orderlist/seller">Attività</Link>
                    </li>
                    <li>
                      <Link to="/orderhistory">Storico</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="#signout" onClick={signoutHandler}>
                    Esci
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div>
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
        </div>
      </header>
      <PostHeader />
      {/* <div className="post-header row center">
        Iscriviti qui:{" "}
        {
          <a className="val_link" href="https://valazco.it">
            valazco.it
          </a>
        }{" "}
        per avere i VAL contributo di emancipazione giornaliero da utilizzare subito
      </div> */}
    </>
  );
}
