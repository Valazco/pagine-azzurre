import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push('/payment');
  }
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  cart.itemsPriceVal = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.priceVal, 0)
  );
  cart.itemsPriceEuro = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.priceEuro, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  // cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
  cart.totalPriceVal = cart.itemsPriceVal;
  cart.totalPriceEuro = cart.itemsPriceEuro;
  const dispatch = useDispatch();
  const placeOrderHandler = (e) => {
    e.preventDefault()
    if( userInfo.hasAd ) {
      dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
    } else {
      window.alert("Per poter conttatare il offerente avere un prodotto in vetrina.")
    }

  };
  useEffect(() => {
    window.scrollTo(0, 0)
    if (success) {
      props.history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET, payload: order });
    }
  }, [dispatch, order, props.history, success]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Spedizione</h2>
                <p>
                  <strong>Nome:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Indirizzo: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  ,{cart.shippingAddress.country}<br/>
                  {cart.shippingAddress.email && (<strong>Email: </strong>)}
                  {cart.shippingAddress.email && cart.shippingAddress.email}<br/>
                  {cart.shippingAddress.phone && (<strong>Telefono: </strong>)}
                  {cart.shippingAddress.phone && cart.shippingAddress.phone}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Pagamento spedizione</h2>
                <p>
                  <strong>Metodo: Da concordare con l'offerente</strong>
                    {/* </strong> {cart.paymentMethod} */}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Articoli dell'ordine</h2>
                <ul>
                  {cart.cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div>
                        {item.qty} x €{item.priceEuro} = €{item.qty * item.priceEuro} e {item.qty} x ☯{item.priceVal} = ☯{item.qty * item.priceVal}  
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Riepilogo dell'ordine</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>€ {cart.itemsPriceEuro.toFixed(2)}</div>
                  <div> e ☯ {cart.itemsPriceVal.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Prezzo spedizione</div>
                  <div>Da concordare con l'offerente</div>
                </div>
              </li>
              {/* <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${cart.taxPrice.toFixed(2)}</div>
                </div>
              </li> */}
              <li>
                <div className="row">
                  <div>
                    <strong>Ordine totale</strong>
                  </div>
                  <div>
                    <strong>☯{cart.totalPriceVal.toFixed(2)}</strong>
                    {' | '}
                    <strong>€{cart.totalPriceEuro.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block"
                  disabled={cart.cartItems.length === 0}
                >
                  Invia richiesta all'offerente
                </button>
                { !userInfo.hasAd && 
                  (
                    <MessageBox variant="alert">
                      Ricordati che per poter entrare in contatto con un offerente devi prima mettere un prodotto in vetrina. <br></br> <Link to='/productlist/seller'>Crea l'annuncio addeso</Link>
                    </MessageBox>
                  )
                }
              </li>
              {loading && <LoadingBox></LoadingBox>}
              {error && <MessageBox variant="danger">{error}</MessageBox>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
