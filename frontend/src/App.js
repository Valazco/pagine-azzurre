import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { signout } from './actions/userActions';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import PasswordRecovery from './screens/PasswordRecoveryScreen';
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { listProductCategories } from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import MapScreen from './screens/MapScreen';
import logo1 from './resources/logos/magic_hands.jpg';
import logo2 from './resources/logos/bannerarancione.jpg';
import logo3 from './resources/logos/yinyang.jpg';
import logo4 from './resources/logos/bannerblu.jpg';
import logo5 from './resources/logos/bannergiallo.jpg';

function App() {
  const cart = useSelector((state) => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  
  useEffect(() => {
    console.log("From App:", userInfo)
    dispatch(listProductCategories());
  }, [dispatch, userInfo]);

  return (
    <BrowserRouter>
      <div className="grid-container">
      <div className="blubar"></div>
      <div className="pre-header row center">
        PAGINE  AZZURRE  del VAL - PAGINE AZZURRE  del  VAL.AZ.CO. -  VALorizzatore del AZione COncordata
      </div>
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
            <img className="Logo1" src={logo1} alt="Logo" />
          </div>
          <div>
            <img className="Logo2" src={logo2} alt="Logo" />
          </div>
          <div>
            <img className="Logo3" src={logo3} alt="Logo" />
          </div>
          <div>
            <img className="Logo4" src={logo4} alt="Logo" />
          </div>
          <div>
            <img className="Logo5" src={logo5} alt="Logo" />
          </div>
          <div>
            <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}
            ></Route>
          </div>
          { userInfo === 'null' ? (
            <div>
              <Link to="/cart">
                Carrello
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>
            </div>
            ) : ('')
          }
          { userInfo ? ('') : (
            <div>
              <Link to="/register">
                Registrati
              </Link>
            </div>)
          }
          {userInfo ? (
            <div className="dropdown last-element">
              <Link to="#">
                {userInfo.username} <i className="fa fa-caret-down"></i>{' '}
              </Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/profile">Profilo</Link>
                </li>
                <li>
                  <Link to='/product'>Crea annuncio</Link>
                </li>
                <li>
                  <Link to="/orderhistory">Istoriale</Link>
                </li>
                <li>
                  <Link to="#signout" onClick={signoutHandler}>
                    Uscire
                  </Link>
                </li>
              </ul>
            </div>
            ) : (
              <div className="last-element">
                <Link to="/signin">Accedi</Link>
              </div>
            )}
            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  Venditore <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist/seller">Prodotti</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Ordini</Link>
                  </li>
                </ul>
              </div>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
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
        <div className="post-header row center">
          Iscriviti qui: {<a className="val_link" href="https://valazco.it">valazco.it</a>} per avere i VAL contributo di esistenza giornaliero da utilizzare subito
        </div>
        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li>
              <strong>Categorie</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path="/seller/:id" component={SellerScreen}></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
          <Route path="/product/" component={ProductEditScreen}></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
          <Route path="/search/name/:name?" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category/name/:name" component={SearchScreen} exact></Route>
          <Route path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber" component={SearchScreen} exact></Route>
          <Route path="/password-recovery" component={PasswordRecovery} exact></Route>
          <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
          <PrivateRoute path="/map" component={MapScreen}></PrivateRoute>
          <AdminRoute path="/productlist" component={ProductListScreen} exact></AdminRoute>
          <AdminRoute path="/productlist/pageNumber/:pageNumber" component={ProductListScreen} exact></AdminRoute>
          <AdminRoute path="/orderlist" component={OrderListScreen} exact></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
          <SellerRoute path="/productlist/seller" component={ProductListScreen}></SellerRoute>
          <SellerRoute path="/orderlist/seller" component={OrderListScreen}></SellerRoute>
          <Route path="/" component={HomeScreen} exact></Route>
        </main>
        <footer className="row center">Un progetto fatto con <span className="emoji" role="img" aria-label="a heart">❤️</span> dal team  {<a href="https://valazco.it">valazco.it</a>}</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
