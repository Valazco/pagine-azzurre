import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function Product(props) {
  const { product } = props;
  return (
    <div key={product._id} className="card">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.image[0]} alt={product.name} />
      </Link>
      <div className="row center">{ product.section !== 'avviso' && product.section !== 'propongo' ? (product.isService?'Servizio':'Prodotto'):'Avviso/Proposta' }</div>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2>{product.name}</h2>
        </Link>
        <div>
            <Link to={`/product/${product._id}`}>
              { product.seller.seller.name }
            </Link>
        </div>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
          { product.section !== 'propongo' &&
            (
              <div className="row start">
                <div className="price euro">€{' '+product.priceEuro}&nbsp;{' e'}</div>
                <div className="price">&nbsp;&nbsp;☯{' '+product.priceVal}</div>
              </div>
            )
          }
      </div>
    </div>
  );
}
