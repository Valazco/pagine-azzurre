import React, { useEffect, useState }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userPasswordReplacement } from '../actions/userActions'
import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'

export default function ChangePassword(props){

  const dispatch = useDispatch()

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState('')

  const userPasswordChange = useSelector(state => state.userPasswordReplacement)
  const { loading, password_replacement } = userPasswordChange;

  const submitHandler = (e) => {
    e.preventDefault()
    console.log(newPassword.length)
    if(newPassword === confirmNewPassword && newPassword.length >= 6 ) {
      setNewPassword('')
      dispatch(userPasswordReplacement(newPassword, props.match.params.id))
    } else {
      if (newPassword !== confirmNewPassword) setPasswordMatch('Differ')
      if (newPassword.length < 6) setPasswordMatch('tooShort')
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if(password_replacement) props.history.push('/signin')
  }, [password_replacement])

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="row center">Ripristina la tua Password</h1>
          <label htmlFor="password">Nuova Password</label>
          <input
            id="password"
            type="password"
            placeholder="Digita nuova password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Conferma Nuova Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Inserire conferma di password"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        { passwordMatch === 'Differ'?<MessageBox variant="alert">Password e conferma password devono essere uguali</MessageBox>:''}
        { passwordMatch === 'tooShort'?<MessageBox variant="alert"> La password deve avere almeno 6 caratteri</MessageBox>:<br/>}
        { loading ? <LoadingBox/>:''}
        <br/>
        <div>
          <button className="primary blu big" type="submit">
            Ricupera Password
          </button>
        </div>
      </form>
    </div>
  )
}