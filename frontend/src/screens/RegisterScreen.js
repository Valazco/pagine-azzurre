import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasReferer, setHasReferer] = useState(false)
  const [referer, setReferer] = useState([])
  const [newReferer, setNewReferer] = useState('')
  const [newsletter, setNewsletter] = useState(false)

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword && email !== confirmEmail) {
      alert('- Le Password non coincidono\n- Controlla la esatteza della email.');
    }
    else if (email !== confirmEmail) {
      alert('Controlla la esatteza della email.');
    }
    else if (password !== confirmPassword) {
      alert('Le Password non coincidono');
    } else {
      /* set Phone and CF same as email because both required as true
         but register process don't use this values anymore
         It should be register(username, email, password, phone, cf)
      */
      let cf = ''
      email.split('').forEach( l => cf += l.charCodeAt(0))
      // TODO: Set seller name as username.
      dispatch(register(username, email, password, username, email, cf, referer, newsletter))
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0)
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);

  const addETS = (e) => {
    e.preventDefault()
    setReferer(referer.concat(newReferer))
    setNewReferer('')
  }

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="row center">Crea il tuo Account </h1>
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            placeholder="Inserisci il username"
            required
            value = { username }
            onChange={(e) => setUsername(e.target.value.toUpperCase())}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Indirizzo Email *</label>
          <input
            type="email"
            id="email"
            placeholder="Inserisci email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Conferma Email *</label>
          <input
            type="email"
            id="confirmEmail"
            placeholder="Conferma email"
            required
            onChange={(e) => setConfirmEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            placeholder="Inserisci password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Conferma Password *</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Conferma password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <div className="row start">
            <label htmlFor="isReferer">Partecipi a gruppi, movimenti, comitati o associazioni no profit?
              <input
                type="radio"
                id="no_referer"
                name="referer"
                onClick={ (e) => setHasReferer(true)}
              />Si
            </label>
            <label>
              <input
                type="radio"
                id="yes_referer"
                name="referer"
                defaultChecked
                onClick={ (e) => setHasReferer(false)}
              />No
            </label>
          </div>
          {
            hasReferer?
              (
                <div>
                  <div className="row">
                    <input
                      type="text"
                      id="referer"
                      placeholder="Inserici l'ente del terzo settore al qualle partecipi"
                      value={ newReferer }
                      // TODO: Autosearch here too! 
                      onChange={(e) => setNewReferer(e.target.value.toUpperCase())}
                    ></input>
                  </div>
                    <div className="row">
                        <ol>
                          {
                            referer.map( (item, idx ) => { 
                              if(idx <= 2){ 
                                return <li key={idx}>{item}</li>
                              } else {
                                return ''
                              } })
                          }       
                        </ol>
                          {
                            newReferer.length > 0 && referer.length < 3 &&
                              (<button className="primary blu little" onClick={addETS}>
                                aggiungi
                              </button>)
                          }
                    </div>
                </div>
              ):''
          }
        </div>
        <div>
          <div className="row start">
            <label htmlFor="newsletter">Vuoi inscriverti alla nostra newsletter?
              <input
                type="radio"
                id="no_referer"
                name="newsletter"
                onClick={ (e) => setNewsletter(true)}
              />Si
            </label>
            <label>
              <input
                type="radio"
                id="yes_referer"
                name="newsletter"
                defaultChecked
                onClick={ (e) => setNewsletter(false)}
              />No
            </label>
          </div>
        </div>
        <div>
          {loading && <LoadingBox></LoadingBox>}
          {error && <MessageBox variant="alert">{error}</MessageBox>}
        </div>
        <div>
          <MessageBox variant="info">Nello spirito di scambio in solidarietà di beni, per vantaggi comuni; sei invitato a creare un annuncio. Una proposta o una  richiesta, per scambiare prodotti  servizi e conoscenze. Dove c’è scambio c’è vita. Sovranità consapevolezza</MessageBox>
          <div><p className="asterisk">(*) Campi Obbligatori</p></div>
          <button className="primary blu big" type="submit">
            Registrati
          </button>
        </div>
        <div>
          <label />
          <div>
            Hai già un account?{' '}
            <Link to={`/signin?redirect=${redirect}`}>Accedi</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
