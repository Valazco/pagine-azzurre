// import Axios from 'axios';
// import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import { deliverOrder, detailsOrder, mailingOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  // const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const mailingDetails = useSelector((state) => state.orderMailing)
  const { loading: loading_mailing, resp_code } = mailingDetails
  const uniqueNotification = useSelector((state) => state.orderDoubleNotification)
  const { loading: loading_unique_mailing, resp_code: resp_code_double } = uniqueNotification
  const [mailing, setMailing] = useState(false)
  const [emailBody, setEmailbody] = useState('Puoi aggiungere informazione al offerente per fare più facile tutto, come proporre un punto, ora e data di incontro. Cancella questo testo e scrivi quello che vuoi.')
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0)
    // const addPayPalScript = async () => {
    //   const { data } = await Axios.get('/api/config/paypal');
    //   const script = document.createElement('script');
    //   script.type = 'text/javascript';
    //   script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    //   script.async = true;
    //   script.onload = () => {
    //     setSdkReady(true);
    //   };
    //   document.body.appendChild(script);
    // }; 
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } 
    // else {
    //   if (!order.isPaid) {
    //     if (!window.paypal) {
    //       addPayPalScript();
    //     } else {
    //       setSdkReady(true);
    //     }
    //   }
    // }
  // }, [dispatch, orderId, sdkReady, successPay, successDeliver, order]);
  }, [dispatch, orderId, successPay, successDeliver, order]);

  // const successPaymentHandler = (paymentResult) => {
  //   dispatch(payOrder(order, paymentResult));
  // };
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  const askAnotherEmail = (e) => {
    e.preventDefault()
    let envelop = { buyer: userInfo.username, emailBody, order }
    // TODO debug
    if(mailing){
      dispatch(mailingOrder(envelop))
    } else {
      setMailing(true)
    } 
  }

  const tagAsPayed = (e) => {
    dispatch(payOrder(order, true))
  }
  

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="flash">
      <h1>Ordine {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Spedizione</h2>
                <p>
                  <strong>Nome:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Indirizzo: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Consegnato a {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">No Consegnato</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Pagamento</h2>
                <p>
                  <strong>Metodo:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Pagato: {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">No Pagato</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
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
                          {item.qty} x ☯{item.priceVal} = ☯{item.qty * item.priceVal}
                        </div>
                        <div>
                          e {item.qty} x €{item.priceEuro} = €{item.qty * item.priceEuro}
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
              <li className="row center">
                <h2>Riepilogo dell'ordine</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  {order.itemsPriceVal && <div>☯{order.itemsPriceVal.toFixed(2)}</div>}
                  e
                  { order.itemsPriceEuro && <div>€{order.itemsPriceEuro.toFixed(2)}</div>}
                </div>
              </li>
              <li>
                <div className="row">
                  <strong>Spedizione</strong>
                  <br/>
                  {/* <div>€{order.shippingPrice.toFixed(2)}</div> */}
                  <div className="notification-blue">
                    L'offerente ha ricevuto una email con i tuoi dati di conttato.<br></br>
                    Controlla la tua email per avere i dati di conttato del offerente e concordare direttamente la forma di pago e consegna.
                  </div>

                </div>
              </li>
              {/* <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li> */}
              <li>
                <div className="row">
                  <div>
                    <strong>Ordine totale</strong>
                  </div>
                  <div>
                    <strong>☯{order.totalPriceVal.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="row">
                  <div>
                    <div>e</div>
                  </div>
                  <strong>{order.totalPriceEuro && '€'+order.totalPriceEuro.toFixed(2)}</strong>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  { loading ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                      {/* <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton> */}
                      { order.seller !== userInfo._id && resp_code === 0 ?
                        (<>
                          <button
                            type="button"
                            className="primary block col-1"
                            onClick={askAnotherEmail}
                          >
                            {!mailing?'Vuoi mandare una seconda EMAIL al offerente?':'Invia'}
                          </button>
                          <div className="row center">
                          <Link to='/'>
                           Chiudi e torna alla vetrina
                          </Link>
                        </div>
                        </>)
                        :''}
                      { order.seller === userInfo._id && order.isPaid === false &&
                        (
                          <button
                            type="button"
                            className="primary block"
                            onClick={tagAsPayed}
                          >
                            {'Segnala pagamento ricevuto'}
                          </button>
                        )
                      }
                      { loading_mailing && <LoadingBox></LoadingBox> }
                      { resp_code === 2
                          ?
                            <>
                              <MessageBox variant="success">Email Consegnato al offerente</MessageBox>
                              <Link to='/'>Torna alla vetrina</Link>
                            </>
                          :
                          ''
                      }
                      {mailing && resp_code === 0 && (
                        <div>
                          <textarea id="mailing"
                                    name="mailing"
                                    rows="4"
                                    cols="93"
                                    value={ emailBody }
                                    onChange={ (e) => setEmailbody((e.target.value))}
                                    style={{ resize:"vertical",
                                             maxHeight: "20rem",
                                             minHeight: "15rem",
                                             margin: "3rem" }}
                        ></textarea>
                        </div>)
                      }
                    </>
                  )}
                </li>
              )}
              { userInfo._id !== order.seller && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  {errorDeliver && (
                    <MessageBox variant="danger">{errorDeliver}</MessageBox>
                  )}
                  <button
                    type="button"
                    className="primary block"
                    onClick={deliverHandler}
                  >
                    Segna l'ordine "Consegnato"
                  </button>
                </li>
              )}
              { userInfo._id !== order.seller && order.isPaid && order.isDelivered && 
                <>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            Lascia una recensione per {item.name}
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}