import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newsletter } from '../actions/userActions'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'


export default function Newsletter(){
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const dispatch = useDispatch()

  const userNewsletter = useSelector((state) => state.userNewsletter)

  const { loading, subscribed, message } = userNewsletter

  const submitHandler = (e) => {
    window.scrollTo(0, 0)
    e.preventDefault()
    dispatch(newsletter(name, email))
  }

  return (
    <div className="squeeze">
      <div className="newsletter">
        <h1 className="row center">Vorremo invitarti alla newsletter delle Pagine Azzurre</h1>
        {/* <p style={{textAlign:"justify"}}>
          Nei team delle pagine_azzurre.it e valazco.it pensiamo che tutti abbiamo il diritto (anche il obbligo) di cercare di migliorare il mondo.
          E visto che siamo sicuri che le pagine azzurre sarà qualcosa che ci avvicinerà a avvere un mondo più bello e pensato meglio. Vorremmo offrire la possibilità alle più persone possibile di iniziare tutti insieme questa nuova avventura per ripensare l'economia.
        </p> */}
        
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h2 className="row center">Iscrivitti alla nostra Newsletter</h2>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              placeholder="Inserici il tuo nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Inserici la tua email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          { loading && <LoadingBox/> }
          { subscribed && <MessageBox variant="success">Email suscrito in attesa di conferma</MessageBox> }
          { message === 'Email already subscribed but not verified' && <MessageBox variant="alert">La richiesta di iscrizione è già stata effettuata, manca la tua conferma</MessageBox> }
          { message === 'Email already subscribed' && <MessageBox variant="success">Ti ringraziamo per la riconferma di iscrizione</MessageBox> }
          <div>
            <label />
            <button className="primary blu big" type="submit">
              Iscriviti alla Newsletter
            </button>
          </div>
          <div>
            <label />
          </div>
        </form>
      </div>
    </div>
  )
}