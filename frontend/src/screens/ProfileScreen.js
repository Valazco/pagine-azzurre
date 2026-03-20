import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { detailsUser, updateUserProfile, updateNewsletter } from '../actions/userActions'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'
import 'react-day-picker/lib/style.css'
import Select from 'react-select'
import Axios from 'axios'
import options from '../resources/citiesOptions.js'
import QRCode from "react-qr-code"

import Web3 from 'web3'
import SContract from '../web3Interface/abi.js'

export default function ProfileScreen() {
  const [web3, setWeb3] = useState(null)
  const [contract, setContract] = useState(null)
  const [web3Config, setWeb3Config] = useState(null)
  const [account, setAccount] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState('')
  const [birthplace, setBirthplace] = useState('')
  const [city, setCity] = useState({ value: '', label: '' })
  const [cf, setCf] = useState('')
  const [zipCode, setZipcode ] = useState('') 
  const [phone, setPhone ] = useState('') 
  const [referer, setReferer ] = useState([])
  const [newReferer, setNewReferer ] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [sellerLogo, setSellerLogo] = useState('')
  const [sellerDescription, setSellerDescription] = useState('')
  const [hasReferer, setHasReferer] = useState(false)
  const [partitaIva, setPartitaIva] = useState('')
  const [sellerLink, setSellerLink] = useState('')
  const [newsletter, setNewsletter] = useState('')
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorUpload, setErrorUpload] = useState('')
  const [newsletterUpdate, setNewsletterUpdate] = useState(false)
  const [balance, setBalance] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [hideField, setHideField] = useState("none")

  function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale })
    if (DateUtils.isDate(parsed)) {
      return parsed
    }
    return undefined
  }

  function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale })
  }

  async function getSetBalance(account) {
    if (!contract) return
    try {
      let balance = await contract.methods.balanceOf(account).call()
      balance = parseFloat(balance) / 100
      setBalance(balance)
    } catch (error) {
      console.error('Error getting balance:', error)
    }
  }

  const handleChange = selectedOption => {
    setCity({ value: selectedOption.value, label: selectedOption.value })
    console.log(`Option selected:`, selectedOption)
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    console.log("File", file)
    const bodyFormData = new FormData()
    bodyFormData.append('image', file)
    setLoadingUpload(true)
    try {
      const { data } = await Axios.post('/api/uploads/s3', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      setSellerLogo(data)
      setLoadingUpload(false)
    } catch (error) {
      setErrorUpload(error.message)
      setLoadingUpload(false)
    }
  };

  const GetFormattedDate = (birthday) => {
    if (typeof birthday === 'object') {
      var day = birthday.getDate()
      var month = birthday.getMonth() + 1
      var year = birthday.getFullYear()
      setBirthday(`${day}/${month}/${year}`)
    }
  }
  const CalFORMAT = 'dd/MM/yyyy'
  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin
  // TODO: Delete referer from userInfo
  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile

  const dispatch = useDispatch()

  // Fetch Web3 configuration from backend
  useEffect(() => {
    const fetchWeb3Config = async () => {
      try {
        const { data } = await Axios.get('/api/config/web3')
        setWeb3Config(data)
      } catch (error) {
        console.error('Error fetching Web3 config:', error)
      }
    }
    fetchWeb3Config()
  }, [])

  // Initialize Web3 and contract when config is loaded
  useEffect(() => {
    if (web3Config && web3Config.infuraUrl) {
      try {
        const web3Instance = new Web3(web3Config.infuraUrl)
        const deployedNetwork = SContract.networks[web3Config.networkId]
        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            SContract.abi,
            deployedNetwork.address
          )
          setWeb3(web3Instance)
          setContract(contractInstance)
        }
      } catch (error) {
        console.error('Error initializing Web3:', error)
      }
    }
  }, [web3Config])

  useEffect(() => {
    // TODO: For security reasons split db
    window.scrollTo(0, 0)
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET })
      dispatch(detailsUser(userInfo._id))
    } else {
      setName(user.name)
      setSurname(user.surname)
      setAccount(user.account)
      setUsername(user.username)
      setGender(user.gender)
      setBirthday(user.birthday)
      setBirthplace(user.birthplace)
      setCf(user.cf)
      setZipcode(user.zipCode)
      setCity({value: user.city, label: user.city})
      setPhone(user.phone)
      setEmail(user.email)
      setReferer(user.referer)
      setNewsletter(user.newsletter)
      setPassphrase(user.accountKey)
      if (typeof parseInt(user.partitaIva) === 'number' ) setPartitaIva(user.partitaIva)
      if (user.seller) {
        setSellerName(user.seller.name)
        setSellerLogo(user.seller.logo)
        setSellerDescription(user.seller.description)
        setSellerLink(user.seller.link)
      }
    }
  }, [dispatch, userInfo._id, user, userInfo])

  // Get balance when contract and account are ready
  useEffect(() => {
    if (contract && account) {
      getSetBalance(account)
    }
  }, [contract, account])

  const submitHandler = (e) => {
    // dispatch update profile
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password e Conferma password non corrispondono')
    } else {
      dispatch(
        updateUserProfile({
          userId: user._id,
          name,
          surname,
          username,
          gender,
          birthday,
          birthplace,
          cf,
          email,
          phone,
          referer,
          city: city.value,
          zipCode,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
          sellerLink,
        })
      );
    }
    if(newsletterUpdate){
      dispatch(updateNewsletter(username, email))
    }
  };

  const addETS = (e) => {
    e.preventDefault()
    setReferer(referer.concat(newReferer))
    setNewReferer('')
  }

  const showPk = (e) => {
    e.preventDefault()
    setHideField("inline")
  }

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div className="flash">
          <h1 className="row center">Profilo dell'utente</h1>
          {
              userInfo && !userInfo.verified && (
              <MessageBox variant="alert">
                L'account deve essere ancora verificato:<br/>
                1) Esci dalle pagineazzure.net<br/>
                2) Controlla la tua mail<br/>
                3) Conferma cliccando il link di verifica  
              </MessageBox>
          )}
        </div>
        { loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
            {successUpdate && (
              <MessageBox variant="success">
                Profilo aggiornato con successo
              </MessageBox>
            )}
            <div>
              <label htmlFor="name">Username *</label>
              <input
                id="name"
                type="text"
                placeholder="Aggiungere Username"
                value={username}
                readOnly
                style={{color: "#5A5A5A", fontSize: "1.8rem"}}
              ></input>
            </div>
            { userInfo && userInfo.verified &&
              <>
              <div>
                  <label htmlFor="account">Valazco account</label>
                  <input type="text" readOnly value={account} style={{display:"inline", whiteSpace:"nowrap", color: "#5A5A5A", fontSize: "1.8rem"}}></input>
              </div>
              <div>
                  <label htmlFor="balance">Saldo</label>
                  <input type="text" readOnly value={'☯ ' + balance } style={{display:"inline", whiteSpace:"nowrap", color: "#3A3A3A", fontSize: "1.8rem"}}></input>
              </div>
              <div>
                <QRCode value={user.account} level={'H'}/>
              </div>
              <div>
                <h2>Integration with Metamask:</h2>
                <label htmlFor="secret">Secret</label>
                <input type="text" readOnly value={ passphrase } style={{display:hideField, whiteSpace:"nowrap", color: "#3A3A3A", fontSize: "1.8rem"}}></input>
                <button onClick={ (e)=>showPk(e) } style={{ display:hideField === 'none' ? 'inline' : 'none' }}>Reveal</button>
              </div>
              <div>
                <h2>Dati anagrafici:</h2>
                <label htmlFor="name">Nome *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Aggiungere nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="surname">Cognome *</label>
                <input
                  id="surname"
                  type="text"
                  placeholder="Aggiungere cognome"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="birthday">Data di Nascita *</label>
                <DayPickerInput
                  parseDate={parseDate}
                  format={CalFORMAT}
                  formatDate={formatDate}
                  value={birthday}
                  placeholder={`${dateFnsFormat(new Date(), CalFORMAT)}`}
                  onDayChange={(e)=>GetFormattedDate(e)}
                />
              </div>
              <div>
                <label htmlFor="gender">Genere *</label>
                  <label htmlFor="male">
                    <input type="radio" id="male" name="gender" value="M" checked={gender==='M'?true:false} onChange={(e) => setGender(e.target.value)}/>
                    M
                  </label>
                  <label htmlFor="female">
                    <input type="radio" id="female" name="gender" value="F" checked={gender==='F'?true:false}onChange={(e) => setGender(e.target.value)}/>
                    F
                  </label>
              </div>
              <div>
                <label htmlFor="birthplace">Comune di Nascita *</label>
                <input
                  type="text"
                  id="birthplace"
                  placeholder="Aggiungere comune di nascita"
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value.toUpperCase())}
                ></input>
              </div>
              <div>
                <label htmlFor="cf">Codice Fiscale *</label>
                <input
                  type="text"
                  id="cf"
                  maxlenght="16"
                  placeholder="Inserisci il Codice Fiscale"
                  value={cf.length>16?'':cf}
                  onChange={ (e) => { if(e.target.value && e.target.value.length <= 16) {
                                        return setCf(e.target.value.toUpperCase())
                                      } else if (e.target.value === '') {
                                        return setCf('')
                                      }
                                    }
                  }
                ></input>
              </div>
              <div>
                <h2>Dettagli contatto:</h2>
                <label htmlFor="email">Email **</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Aggiungere email"
                  value={email}
                  readOnly
                  style={{color: "#5A5A5A", fontSize: "1.8rem"}}
                ></input>
              </div>
              <div>
                <label htmlFor="city">Provincia *</label>
                <Select value={{ value: city.value, label: city.label}}
                        options={options}
                        placeholder="Aggiungere provincia di domicilio"
                        onChange={handleChange}
                        getOptionValue={(option) => option.value}
                        getOptionLabel={(option) => option.value}
                />
              </div>
              <div>
                <label htmlFor="zipCode">CAP</label>
                <input
                  id="zipCode"
                  type="number"
                  placeholder="Aggiungere CAP"
                  value={zipCode}
                  onChange={(e) => setZipcode(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="phone">Telefono</label>
                <input
                  id="phone"
                  type="number"
                  placeholder="Aggiungere telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></input>
              </div>
              <div>
                { referer.length === 0 ?
                  (<div className="row start flex-container">
                    <label htmlFor="isReferer">Partecipi a gruppi, movimenti, comitati o associazioni no profit?
                      <input
                        type="radio"
                        id="no_referer"
                        name="isReferer"
                        onClick={ (e) => setHasReferer(true)}
                      /> Si
                    </label>
                    <label>
                      <input
                        type="radio"
                        id="yes_referer"
                        name="isReferer"
                        onClick={ (e) => setHasReferer(false)}
                        defaultChecked
                      /> No
                    </label>
                  </div>)
                :''
                }
                {
                  hasReferer || referer.length > 0 ?
                    (
                      <div>
                        <label htmlFor="referer" className="row ">Gruppi, movimenti, comitati o associazioni no profit</label>
                        <div className="row">
                          <input
                            type="text"
                            id="referer"
                            placeholder="Inserici al massimo numero cinque associazioni."
                            value={ newReferer }
                            // TODO: Autosearch here!
                            onChange={(e) => setNewReferer(e.target.value.toUpperCase())}
                          ></input>
                      </div>
                      {
                        <div className="row">
                            <ol>
                            {
                                referer.map( (item, idx ) => {
                                  if(idx <= 4){
                                  return <li key={idx}>{item}</li>
                                  } else {
                                    return ''
                                  }
                                })
                            }
                            </ol>
                              {
                                newReferer.length > 0 && referer.length < 5 &&
                                  (<button className="primary blu little" onClick={addETS}>
                                    aggiungi
                                  </button>)
                              }
                        </div>
                      }
                      </div>
                    ):''
                }
              </div>
              <div>
                <h2>Iscrizione Newsletter:</h2>
                {newsletter === "Verified" ? <MessageBox variant="success">Iscritto</MessageBox>  : <MessageBox variant="info">Non iscritto</MessageBox> }
              </div>
              <div className="row start flex-container">
                  <label htmlFor="newsletter">{newsletter === "Not Verified" ? "Vuoi iscriverti alla nostra newsletter" : "Vuoi annullare l'iscrizione alla nostra newsletter"}
                    <input
                      type="radio"
                      id="no_referer"
                      name="newsletter"
                      onClick={ (e) => setNewsletterUpdate(true)}
                    />Si
                  </label>
              </div>
              {user.isSeller && (
                <>
                  {/* <div>
                    <h2>Dati Offerente:</h2>
                    <label htmlFor="sellerName">Nome offerente</label>
                    <input
                      id="sellerName"
                      type="text"
                      placeholder="Inserici il tuo nome di offerente"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                    ></input>
                  </div> */}
                  <div>
                    <h2>Dati Offerente:</h2>
                    <label htmlFor="sellerLogo">Logo:</label>
                    { loadingUpload && <LoadingBox></LoadingBox> }
                    { errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox> }
                    { sellerLogo &&
                    <div>
                      <img alt={`${name} logo`} src={sellerLogo} style={{ display: "block",  maxWidth:"115px", maxHeight:"115px", width: "auto", height: "auto" }}/>
                    </div>
                  }
                    <input
                      type="file"
                      id="sellerLogo"
                      accept="image/jpeg"
                      onChange={uploadFileHandler}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="linkweb">Pagina Web</label>
                    <input
                      id="linkweb"
                      type="url"
                      placeholder="Inserici link della propria pagina web"
                      value={sellerLink}
                      onChange={(e) => setSellerLink(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="partitaIva">Partita IVA</label>
                    <input
                      id="partitaIva"
                      type="text"
                      placeholder="Inserici partita IVA"
                      value={!partitaIva.match(/GMT/)?partitaIva:''}
                      onChange={(e) => setPartitaIva(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="sellerDescription">Descrizione Offerente</label>
                    <textarea
                      id="sellerDescription"
                      type="text"
                      placeholder="Inserici descrizione di offerente"
                      rows="6"
                      value={sellerDescription}
                      onChange={(e) => setSellerDescription(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
              <div>
                <h2>Cambio Password:</h2>
                <label htmlFor="password">Cambiare Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digita nuova password"
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="confirmPassword">Conferma Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Inserire conferma di password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></input>
              </div>
              <div className="asterisk">
                <div className="little-line">(**)  Campo non modificabile</div>
                <div className="little-sisterline">(*) Campi obbligatori per offrire beni o servizi su le pagine azzurre</div>
              </div>
              <>
                {
                loading ? (
                  <LoadingBox></LoadingBox>
                ) : error ? (
                  <MessageBox variant="danger">{error}</MessageBox>
                ) : loadingUpdate && <LoadingBox></LoadingBox> ?
                    errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox> :
                    successUpdate && (
                      <MessageBox variant="success">
                        Profile Updated Successfully
                      </MessageBox>
                    )
                  } 
              </>
              <div>
                <button className="primary blu big" type="submit">
                  Aggiorna Profilo
                </button>
              </div>
            </>
            }
          </>
        )}
      </form>
    </div>
  )
}
