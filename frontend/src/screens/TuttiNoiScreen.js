import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { listSellers } from '../actions/userActions'
import questionMark from '../resources/logos/informazioni.png'
import { Link } from 'react-router-dom'


export default function TuttiNoi() {
  const dispatch = useDispatch();
  const userSellersList = useSelector((state) => state.userSellersList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userSellersList;

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(listSellers());
  }, [dispatch]);

  return (
    <>
      <h1 className="row center">Le Pagine Azzurre Siamo Noi <img className="qm" src={questionMark} alt="question mark"/><div className="qm_hidden">Per comparire in questa sezione aggiungi una immagine e una descrizione nel tuo profilo</div></h1>
      <div>
      { loadingSellers ? (
        <LoadingBox></LoadingBox>
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : ( 
        <>
          {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
            {sellers.map((seller) => (
              ((seller.seller.logo && seller.seller.description) && (<div className="scheda" key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <h1 className="row center">{seller.seller.name}</h1>
                  <img className="row center" src={seller.seller.logo} alt={seller.seller.name} />
                  <p>{seller.seller.description}</p>
                </Link>
              </div>))
            ))}
        </>
      )}
    </div>
    </>
  )
}
