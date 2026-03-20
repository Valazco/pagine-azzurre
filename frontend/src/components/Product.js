import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import imgNotFound from "./../resources/img-not-found.png";

export default function Product({ product }) {
  return (
    <div key={product._id} className="card card--tile">
      <Link className="card__img-container" to={`/product/${product._id}`}>
        <img
          className="medium"
          width="280"
          height="280"
          src={product.image[0]}
          alt={product.name}
          loading="lazy"
          onError={({ currentTarget }) => {
            currentTarget.src = null;
            currentTarget.src = imgNotFound;
            currentTarget.style.objectFit = "cover";
          }}
        />
      </Link>
      <div className="card__text">
        <div className="row center">
          {product.section !== "avviso" && product.section !== "propongo"
            ? product.isService
              ? "Servizio"
              : "Prodotto"
            : "Avviso/Proposta"}
        </div>

        <div className="card-body">
          <Link to={`/product/${product._id}`}>
            <h2 className="card__product-name">{product.name}</h2>
          </Link>
          <div className="card__details">
            <div className="card__product-seller">
              <Link to={`/product/${product._id}`}>
                {product.seller.seller.name}
              </Link>
            </div>
            <Rating
              rating={product.rating}
              numReviews={product.numReviews}
            ></Rating>
            {/* {(product.section !== "propongo" || product.section !== "avviso") && ( */}
            {(product.section !== "propongo" && product.section !== "avviso" && product.section !== 'dono') && (
              <div className="card__price-container">
                <div className="price euro">
                  €{" " + product.priceEuro}&nbsp;{" e"}
                </div>
                <div className="price">
                  &nbsp;&nbsp;☯{" " + product.priceVal}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}