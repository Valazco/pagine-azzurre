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
        finalizzati alla emancipazione umana, per mezzo delle convenzioni monetarie:
        EUR Euro. USD Dollaro Americano. RUR Rublo Russo. CAN Dollaro Canadese.
        CNY Yuan Cinese.  INR  Rupia Indiana. BRL Real Brasiliano.
        XDR Moneta Fondo Internazionale (IMF).
        AUD Dollaro Australiano. CRIPTO. Ma preferiamo: VAL, Crediti, G1, RISO e ne richiediamo almeno l'utilizzo parziale.
      </h2>
      <div>
        <i>PAGINEAZZURRE è una attività promossa e gestita dal Banco dei Cittadini Volontari del VAL.AZ.CO. (VALorizzatore AZioni COncordate) più semplicemente VAL, sito istituzionale: <a href="https://valazco.org">https://valazco.org</a></i>
      </div>
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
      <div className="row center welcome">Pagineazzurre è una attività promossa e gestita dal Banco dei Cittadini Volontari del Val.Az.Co.&nbsp;
        <a href="http://valazco.org/scopri-pagine-azzurre.html" target="_blank" rel="noopener noreferrer">
          http://valazco.org
        </a>
      </div>
    </div>
  );
}
