import React, { useEffect, useState } from 'react';
import WelcomeBanner from '../components/WelcomeBanner'
// import { Carousel } from 'react-responsive-carousel/lib/styles/carousel.min.css'
import Product from '../components/Product'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
// import { listTopSellers } from '../actions/userActions';
import CookieConsent from "react-cookie-consent"
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  // const userTopSellersList = useSelector((state) => state.userTopSellersList);
  // const {
  //   loading: loadingSellers,
  //   error: errorSellers,
  //   users: sellers,
  // } = userTopSellersList;

  const [section, setSection] = useState('offro')

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(listProducts({}));
    // dispatch(listTopSellers());
  }, [dispatch]);
  return (
    <div>
      <WelcomeBanner/> 
        <CookieConsent
          location="bottom"
          buttonText="Accetto"
          cookieName="pagineazzurre"
          style={{ background: "#626360" }}
          buttonStyle={{ color: "#626360", fontSize: "15px", marginRight: "150px" }}
          expires={150}
        >
          I cookie ci aiutano ad erogare servizi di qualità.<br></br>
          Utilizzando i nostri servizi, l'utente accetta le nostre modalità d'uso dei cookie.
          Qualora l’utente non desideri ricevere alcun tipo di cookie sul proprio elaboratore, né da questo sito né da altri, può elevare il livello di protezione privacy del proprio browser mediante l’apposita funzione,  come specificato di seguito.
          Le pagineazzurre.net fa uso dei cookie. L'informazione più dettagliata nella nostra pagina sulla <Link to="/privacy">Privacy</Link>
        </CookieConsent>
      <div>
      {/* <h2>Top Sellers</h2>
      {loadingSellers ? (
        <LoadingBox></LoadingBox>
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : ( */}
        <>
          {/* {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel> */}
        </>
      {/* )} */}
      <h1 className="row center">ULTIME ATTIVITÀ</h1>
      <div className="row center">
        <button className={ section === 'offro' ? "filter active":"filter"} onClick={()=> setSection('offro')}>Offerte</button>
        <button className={ section === 'cerco' ? "filter active" : "filter"} onClick={()=> setSection('cerco')}>Richieste</button>
        <button className={ section === 'propongo' ? "filter active" : "filter"} onClick={()=> setSection('propongo')}>Proposte</button>
        <button className={ section === 'avviso' ? "filter active" : "filter"} onClick={()=> setSection('avviso')}>Avvisi</button>
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <div className="row center">
            { products.map((product) => {
              // let expired = new Date(product.expiry)
              // let now = new Date()
              // const isExpired = expired.getTime() <= now
              return (!product.name.match(/Annunciø/) && product.section === section && !product.pause && <Product key={product._id} product={product}></Product>)
              })}
          </div>
        </>
      )}
    </div>
    </div>
  );
}
