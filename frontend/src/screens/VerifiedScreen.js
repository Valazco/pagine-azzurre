//import React, { useEffect, useState }  from 'react'
// useState is never used.
import React, { useEffect }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { userVerifyAccount, signout } from '../actions/userActions'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

export default function VerifiedScreen(props) {

  const dispatch = useDispatch()
  const verifyAccount = useSelector((state) => state.userVerifyAccount)
  const { loading, uuid, error } = verifyAccount
  
  // userRegister is never used.
  //const userRegister = useSelector((state) => state.userRegister);
  // userInfo is never used.
  //const { userInfo } = userRegister;

  useEffect(() => {
    window.scrollTo(0, 0)
      if(uuid === ''){
        dispatch(userVerifyAccount(props.match.params.id))
      } else {
        dispatch(signout());
      }
      
  }, [dispatch, props.match.params.id]);
  return (
    <div className="flash">
        { loading && <LoadingBox></LoadingBox> }
        { error && (<><div className="row center welcome"><MessageBox variant="alert">{error}</MessageBox></div></>) }
        { error && <h1 className="row center welcome">Il tuo account non è stato verificato</h1>}
        { !loading && !error &&
          (
            <>
              <h1 className="row center welcome">Il tuo account è stato verificato</h1>
              <Link className="row center welcome" to='/signin'>Accedi</Link>
            </>    
          )
        }
    </div>
  )
}