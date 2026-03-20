import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verifyNewsletter } from '../actions/userActions'

export default function ThankYouScreen(props) {

  const userNewsletterVerify = useSelector((state) => state.userNewsletterVerify)
  // variables never used but declared
  //const { loading, name, message } = userNewsletterVerify
  const { name } = userNewsletterVerify
  const email = props.location.pathname.split("/")[2]
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(verifyNewsletter(email));
  }, [dispatch]);

  return (
    <div className="squeeze">
      <div className="newsletter">
        <h1 className="row center">{`Grazie ${name} per esserti registrato alla newsletter`}</h1>
      </div>
    </div>
  )
}