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
      console.log("cf", cf)
      dispatch(register(username, email, password, email, cf));
    }
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="row center">Crea il tuo Account </h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            placeholder="Inserisci il username"
            required
            onChange={(e) => setUsername(e.target.value)}
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
            id="ConfirmPassword"
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
        <div><p className="asterisk">(*) Campi Obbligatori</p></div>
        <div>
          <label />
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
