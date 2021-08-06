import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps flash2">
      <div className={props.step1 ? 'active' : ''}>Sign-In</div>
      <div className={props.step2 ? 'active' : ''}>Spedizione</div>
      <div className={props.step3 ? 'active' : ''}>Pagamento Spedizione</div>
      <div className={props.step4 ? 'active' : ''}>Invio Richiesta</div>
    </div>
  );
}
