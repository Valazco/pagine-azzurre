import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';

export default function CartScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split('=')[1])
    : 1;
  const cart = useSelector((state) => state.cart);
  const { cartItems, error } = cart;
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0)
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    // delete action
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping');
  };
  return (
    <div className="row top">
      <div className="col-2">
        <h1>Processo di conttato al offerente</h1>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {cartItems.length === 0 ? (
          <MessageBox>
            Il carrelo e vuoto. <Link to="/">Torna alla Vetrina</Link>
          </MessageBox>
        ) : (
          <ul>
            {cartItems.map((item) => (
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
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>
                  <div>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(addToCart(item.product, Number(e.target.value)))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>€{'. '+item.priceEuro}</div>
                  <div> e ☯{item.priceVal}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      Cancella
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <strong>Comincia cercando articoli che ti interessano?</strong>
              <h2>
                totale parziale ({cartItems.reduce((a, c) => a + c.qty, 0)} items) : ☯
                {cartItems.reduce((a, c) => a + c.priceVal * c.qty, 0)} e € {cartItems.reduce((a, c) => a + c.priceEuro * c.qty, 0)}
              </h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                className="primary block"
                disabled={cartItems.length === 0}
              >
                Continua per conttatare offerente
              </button>
              { userInfo && !userInfo.hasAd && 
                (
                  <MessageBox variant="alert">
                    Ricordati che per poter entrare in contatto con un offerente devi prima mettere un prodotto in vetrina. <br></br> <Link to='/productlist/seller'>Crea l'annuncio addeso</Link>  
                  </MessageBox>
                )
              }
              { !userInfo && 
                <MessageBox variant="alert">
                  Devi essere logato.
                </MessageBox>
              }
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
