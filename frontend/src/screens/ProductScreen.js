import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createReview, detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0)
    if (successReviewCreate) {
      window.alert('Review Submitted Successfully');
      setRating('');
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);
  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      console.log(userInfo)
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.username })
      );
    } else {
      alert('Per favore lascia la tua valutazione e un commento');
    }
  };
  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="flash">
          <Link to="/">Torna ai articoli</Link>
          <div className="row top">
            <div className="col-1">
            <Carousel>
              { product.image.map((image, index) => <img src={image} key={index} alt="preview"/>)}
            </Carousel>
            </div>
            <div className="col-1 space">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </li>
                <li>Prezzo in Euro: € {product.priceEuro}</li>
                <li>Prezzo in Val: ☯ {product.priceVal}</li>
                <li>
                  Descrizione:
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    Offerente{' '}
                    <h2>
                      <Link to={`/seller/${product.seller._id}`}>
                        {product.seller.seller.name}
                      </Link>
                    </h2>
                    { product.seller.seller.logo && <img
                      className="medium"
                      src={product.seller.seller.logo}
                      alt={product.seller.seller.name}
                    /> } 
                    <Rating
                      rating={product.seller.seller.rating}
                      numReviews={product.seller.seller.numReviews}
                    ></Rating>
                  </li>
                  <li>
                    <div className="row start">
                      <div style={{paddingRight:"1.8rem"}}>Prezzo</div>
                      <div className="price euro">€{product.priceEuro}&nbsp;</div>
                      <div className="price">e ☯{product.priceVal}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Disponibilità</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">Disponibile</span>
                        ) : (
                          <span className="danger">Non disponibile</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Quantità</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="primary blu block"
                        >
                          Contatta Offerente
                        </button>
                        { userInfo && !userInfo.hasAd && 
                          (
                            <MessageBox variant="alert">
                              Ricordati che per poter entrare in contatto con un offerente devi prima mettere un prodotto in vetrina.<br></br> <Link to='/productlist/seller'>Crea l'annuncio addeso</Link>
                            </MessageBox>
                          )
                        }
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h2 id="reviews">Recensioni</h2>
            {product.reviews.length === 0 && (
              <MessageBox>Non ci sono commenti</MessageBox>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2>Scrivi una recensione del cliente</h2>
                    </div>
                    <div>
                      <label htmlFor="rating">Rating</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Selezionare...</option>
                        <option value="1">1- Scarso</option>
                        <option value="2">2- Discreto</option>
                        <option value="3">3- Buono</option>
                        <option value="4">4- Molto Buono</option>
                        <option value="5">5- Eccellente</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Commento</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="primary blu" type="submit">
                        Pubblica commento
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingBox></LoadingBox>}
                      {errorReviewCreate && (
                        <MessageBox variant="danger">
                          {errorReviewCreate}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageBox>
                    Per favore <Link to="/signin">Accedi</Link> per scrivere una recensione
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
