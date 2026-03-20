// useState is never used.
//import React, { useEffect, useState } from 'react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { listSellers } from '../actions/userActions'
import questionMark from '../resources/logos/informazioni.png'
import { Link } from 'react-router-dom'
import imgNotFound from '../resources/img-not-found.png';


export default function TuttiNoi() {
  const dispatch = useDispatch();
  const userSellersList = useSelector((state) => state.userSellersList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userSellersList;

  

  useEffect(() => {
    dispatch(listSellers());
  }, [dispatch]);

  return (
    <>
      <div className="flash">
        <h1 className="row center">Le Pagine Azzurre Siamo Noi <img className="qm" src={questionMark} alt="question mark"/><div className="qm_hidden">Per comparire in questa sezione aggiungi una immagine e una descrizione nel tuo profilo</div></h1>
        <div className="mobile_sp">
          { loadingSellers ? (
            <LoadingBox></LoadingBox>
          ) : errorSellers ? (
            <MessageBox variant="danger">{errorSellers}</MessageBox>
          ) : ( 
            <>
              {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
              <div className="schede__container">
                {sellers.map((seller) => {
                  return (
                  ((seller.seller.logo && seller.seller.description) && (<div className="scheda_sp" key={seller._id}>
                    <Link className="scheda_sp__elements" to={`/seller/${seller._id}`}>
                      <div className="scheda_sp__img-container">
                        <img 
                          className="row center" 
                          src={seller.seller.logo} 
                          alt={seller.seller.name} 
                          loading="lazy"
                          onError={({ currentTarget }) => {
                            currentTarget.src = null;
                            currentTarget.src = imgNotFound
                            currentTarget.style.objectFit = "cover";
                          }}
                        />
                      </div>
                      <h1 className="row center">{seller.seller.name}</h1>
                      <div className="scheda_sp__description-container">
                        <p>{seller.seller.description}</p>
                      </div>
                    </Link>
                  </div>))
                )})}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
