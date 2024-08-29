import React from "react";

import logo1 from "./../resources/logos/magic_hands.jpg";
import logo2 from "./../resources/logos/bannerarancione.jpg";
import logo3 from "./../resources/logos/valazco-logo.png";
// import logo3 from "./../resources/logos/yinyang.jpg";
import logo4 from "./../resources/logos/bannerblu.jpg";
import logo5 from "./../resources/logos/bannergiallo.jpg";

export default function WelcomeBanner(props) {
  return (
    <div className="flash welcome-banner">
      <h1 className="row center welcome">
        Benvenuti in Pagine Azzurre, piazza dove barattiamo e scambiamo con meno
        Euro e più VAL ☯
      </h1>
      <h2 className="row center welcome">
        Pagine Azzurre favorisce ogni scambio di prodotti, servizi e competenze
        con moneta speculativa: Euro, USD, Cripto, ecc... Meglio se non
        speculativa: VAL, Crediti, Din, ecc...
      </h2>
      <div className="logos-container">
        <div>
          <img className="Logo1 logo" src={logo1} alt="Logo" />
        </div>
        <div>
          <img className="Logo2 logo" src={logo2} alt="Logo" />
        </div>
        <div>
          <img className="Logo3 logo" src={logo3} alt="Logo" />
        </div>
        <div>
          <img className="Logo4 logo" src={logo4} alt="Logo" />
        </div>
        <div>
          <img className="Logo5 logo" src={logo5} alt="Logo" />
        </div>
      </div>
    </div>
  );
}
