import React, { useEffect, useState }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userPasswordRecovery } from '../actions/userActions'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

export default function PasswordRecoveryScreen(props) {
  const [emailInput, setEmail] = useState('')
  
  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/'
  
  const emailStatus = useSelector((state) => state.userPasswordRecovery)
  const { email, loading, error} = emailStatus
  const dispatch = useDispatch()
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(userPasswordRecovery(emailInput))
  };
  useEffect(() => {
    window.scrollTo(0, 0)
    props.history.push('/password-recovery')
  },  [props.history, redirect, emailInput, loading ])
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="row center">Ricupero di Password</h1>
          <label htmlFor="email">Indirizzo email </label>
          <input
            type="email"
            id="email"
            placeholder="Inserici la tua email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          {loading?<LoadingBox></LoadingBox>:email && email !==''?
          <div className="success row center">'Controlla la tua email per confermare il ripristino della password'</div>:
          <div></div>}
          {error && <MessageBox variant="danger">{'L\'email non risulta registrato. Vorresti registrarti addesso?'}</MessageBox>}
        </div>
        <div>
          <label />
          <button className="primary blu big" type="submit">
            Ricupera Password
          </button>
        </div>
        <div>
          <label />
        </div>
      </form>
    </div>
  )
}
