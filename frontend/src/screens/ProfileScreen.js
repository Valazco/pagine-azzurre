import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'react-day-picker/lib/style.css';

export default function ProfileScreen() {
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
  const [referer, setReferer ] = useState('') 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

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
    console.log("User", user)
    if (!user) {
      console.log("UserInfo", userInfo) // ************* here the main Bug
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      console.log(user)
      setName(user.name);
      setSurname(user.surname);
      setUsername(user.username); 
      setGender(user.gender);
      setBirthday(user.birthday);
      setBirthplace(user.birthplace);
      setCf(user.cf);
      setZipcode(user.zipCode);
      setCity(user.city);
      setPhone(user.phone);
      setEmail(user.email);
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, userInfo._id, user]);
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update profile
    if (password !== confirmPassword) {
      alert('Password and Confirm Password Are Not Matched');
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
        })
      );
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 className="row center">User Profile</h1>
        </div>
        {loading ? (
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
                Profile Updated Successfully
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
                onChange={(e) => setBirthplace(e.target.value)}
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
              <label htmlFor="city">Città</label>
              <input
                id="city"
                type="text"
                placeholder="Aggiungere città di domicilio"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              ></input>
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
              <label>
                Participi in una de queste associazioni?
                <select value={referer} onChange={(e) => setReferer(e.target.value)}>
                  <option value="Associazione A">Associazione A</option>
                  <option value="Associazione B">Associazione B</option>
                  <option value="Associazione C">Associazione C</option>
                  <option value="Associazione D">Associazione D</option>
                </select>
              </label>
            </div>
            <div>
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
            {user.isSeller && (
              <>
                <h2>Offerente</h2>
                <div>
                  <label htmlFor="sellerName">Nome offerente</label>
                  <input
                    id="sellerName"
                    type="text"
                    placeholder="Inserici il tuo nome di offerente"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="sellerLogo">Seller Logo</label>
                  <input
                    id="sellerLogo"
                    type="text"
                    placeholder="Inserice immagine di offerente"
                    value={sellerLogo}
                    onChange={(e) => setSellerLogo(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="sellerDescription">Descripzione di Offerente</label>
                  <input
                    id="sellerDescription"
                    type="text"
                    placeholder="Inserici descripzione di offerente"
                    value={sellerDescription}
                    onChange={(e) => setSellerDescription(e.target.value)}
                  ></input>
                </div>
              </>
            )}
            <div>
              <div className="little-line">(**)  Campo non modificabile</div>
              <div className="little-sisterline">(*) Campi obbligatori per offrire beni o servizi su le pagine azzurre</div>
            </div>
            <div>
              <label />
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
