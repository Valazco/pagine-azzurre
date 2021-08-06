import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile, updateNewsletter } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'react-day-picker/lib/style.css';
import Select from 'react-select'
import Axios from 'axios'
import options from '../resources/citiesOptions.js'

export default function ProfileScreen() {
  const [account, setAccount] = useState(''); 
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [city, setCity] = useState('')
  const [cf, setCf] = useState('')
  const [zipCode, setZipcode ] = useState('') 
  const [phone, setPhone ] = useState('') 
  const [referer, setReferer ] = useState([])
  const [newReferer, setNewReferer ] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');
  const [hasReferer, setHasReferer] = useState(false)
  const [partitaIva, setPartitaIva] = useState('')
  const [sellerLink, setSellerLink] = useState('')
  const [newsletter, setNewsletter] = useState('')
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const [newsletterUpdate, setNewsletterUpdate] = useState(false)

  function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  }

  function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log("File", file)
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post('/api/uploads/s3', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setSellerLogo(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
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
  const CalFORMAT = 'dd/MM/yyyy';
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  // TODO: Delete referer from userInfo
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0)
    // TODO: For security reasons split db
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setSurname(user.surname);
      setAccount(user.account);
      setUsername(user.username); 
      setGender(user.gender);
      setBirthday(user.birthday);
      setBirthplace(user.birthplace);
      setCf(user.cf);
      setZipcode(user.zipCode);
      setCity(user.city);
      setPhone(user.phone);
      setEmail(user.email);
      setReferer(user.referer)
      setNewsletter(user.newsletter)
      if (typeof parseInt(user.partitaIva) === 'number' ) setPartitaIva(user.partitaIva)
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
        setSellerLink(user.seller.link)
      }
    }
  }, [dispatch, userInfo._id, user, userInfo]);

  const submitHandler = (e) => {
    // dispatch update profile
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password e Conferma password non corrispondono');
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
          city,
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

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="row center">Profilo di Usuario</h1>
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
            <div>
                <label htmlFor="account">Valazco account</label>
                <input type="text" readOnly value={account} style={{display:"inline", whiteSpace:"nowrap", color: "#5A5A5A", fontSize: "1.8rem"}}></input>
            </div>
            <div>
                <label htmlFor="balance">Saldo</label>
                <input type="text" readOnly value={"☯ 100"} style={{display:"inline", whiteSpace:"nowrap", color: "#3A3A3A", fontSize: "1.8rem"}}></input>
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
              <Select options={options} placeholder="Aggiungere provincia di domicilio" onChange={(e) => setCity(e.target.value.toUpperCase())} />
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
                (<div className="row start">
                  <label htmlFor="isReferer">Partecipi a gruppi, movimenti, comitati o associazioni no profit?
                    <input
                      type="radio"
                      id="no_referer"
                      name="isReferer"
                      onClick={ (e) => setHasReferer(true)}
                    />Si
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="yes_referer"
                      name="isReferer"
                      onClick={ (e) => setHasReferer(false)}
                      defaultChecked
                    />No
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
              <h2>Inscrizione Newsletter:</h2>
              {newsletter === "Verified" ? <MessageBox variant="success">Inscritto</MessageBox>  : <MessageBox variant="info">Non inscritto</MessageBox> }
            </div>
            <div className="row start">
                <label htmlFor="newsletter">{newsletter === "Not Verified" ? "Vuoi inscriverti alla nostra newsletter" : "Vuoi annullare l'iscrizione alla nostra newsletter"}
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
        )}
      </form>
    </div>
  );
}
