import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import Newsletter from '../models/newsletterModel.js';
import dotenv from 'dotenv'
import { generateToken, isAdmin, isAuth } from '../utils.js';
import sgMail from "@sendgrid/mail"
import Web3 from 'web3'
import { msgRegistration, msgPasswordRecovery, msgPasswordReplaced, newsletterWelcome } from '../emailTemplates/mailMsg.js'

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const userRouter = express.Router();

const web3 = new Web3()

userRouter.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(3);
    res.send(topSellers);
  })
);

userRouter.get(
  '/sellers',
  expressAsyncHandler(async (req, res) => {
    const sellers = await User.find({ isSeller: true })
    res.send(sellers);
  })
);

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {   
        res.send({
          _id: user._id,
          account: user.account,
          username: user.username,
          name: user.name,
          surname: user.surname,
          birthday: user.birthday,
          birthplace: user.birthplace,
          gender: user.gender,
          cf: user.cf,
          city: user.city,
          zipCode: user.zipCode,
          phone: user.phone,
          email: user.email,
          referer: user.referer,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          hasAd: user.hasAd,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    let subscriber = false
    let createdUser
    let recipient
    const userPassword = bcrypt.hashSync(req.body.password, 8)
    const userAccount = await web3.eth.accounts.create((userPassword + process.env.ENTROPY))
    const isUser = await User.findOne({ email: req.body.email })
    const isUsername = await User.findOne({ username: req.body.username })
    if(!isUser && !isUsername){
      const user = new User({
        account: userAccount.address,
        accountKey: userAccount.privateKey,
        username: req.body.username,
        cf: req.body.cf,
        email: req.body.email,
        phone: req.body.phone,
        password: userPassword,
        seller: { name: req.body.sellername },
        referer: req.body.referer,
        isSeller: true,
        hasAd: false,
      })
      createdUser = await user.save()
      if ( createdUser.email === req.body.email ) {
        if (req.body.newsletter) {
          subscriber = await Newsletter.findOne({ email: req.body.email })
          if (!subscriber) {
            const newsletterRegistry = new Newsletter({ email: req.body.email, verified: true })
            await newsletterRegistry.save()
            recipient = msgRegistration(createdUser.email, createdUser.username, true)
          } else {
            recipient = msgRegistration(createdUser.email, createdUser.username, true)
          }
        } else {
          recipient = msgRegistration(createdUser.email, createdUser.username, false)
        }
        if(subscriber){
          res.send({
            _id: createdUser._id,
            account: createdUser.account,
            username: createdUser.username,
            email: createdUser.email,
            phone: createdUser.email,
            cf: createdUser.email,
            isSeller: createdUser.isSeller,
            hasAd: createdUser.hasAd,
            referer: createdUser.referer,
            newsletter: true,
            token: generateToken(createdUser)
          })
        } else {
          res.send({
            _id: createdUser._id,
            account: createdUser.account,
            username: createdUser.username,
            email: createdUser.email,
            phone: createdUser.email,
            cf: createdUser.email,
            isSeller: createdUser.isSeller,
            hasAd: createdUser.hasAd,
            referer: createdUser.referer,
            newsletter: false,
            token: generateToken(createdUser),
          })
        }
        sgMail.send(recipient)
        .then((res) => {
          console.log("Welcome email Sent.")
        })
        .catch((error) => {console.error(error)})
      } else {
        res.status(500)
      }
      console.log("Created User: ", createdUser)
    } else {
      if(isUser) {
        res.status(500).send({ message : "Indirizzo già in uso" })
      } else if (isUsername) {
        res.status(500).send({ message : "Username già in uso" })
      } else {
        res.status(500).send({ message : "Errore in registrazione" })
      }
    }
  })
)

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    let userData = {}
    const user = await User.findById(req.params.id);
    userData = {...user._doc}
    if (user) {
      const verifyNewsletter = await Newsletter.findOne({ email: user.email })
      if(verifyNewsletter && verifyNewsletter.verified) { 
        Object.assign( userData, { newsletter : "Verified" } )
      } else {
        Object.assign( userData, { newsletter : "Not Verified" } )
      }
      res.send(userData)
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.account = user.account,
      user.name = req.body.name || user.name;
      user.surname = req.body.surname || user.surname;
      user.username = user.username;
      user.gender = req.body.gender || user.gender;
      user.birthplace = req.body.birthplace || user.birthplace;
      user.birthday = req.body.birthday || user.birthday;
      user.cf = req.body.cf || user.cf;
      user.email = user.email;
      user.city = req.body.city || user.city;
      user.zipCode = req.body.zipCode || user.zipCode;
      user.phone = req.body.phone || user.phone;
      user.referer = req.body.referer || user.referer;
      user.isSeller = user.isSeller
      user.hasAd = user.hasAd
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description = req.body.sellerDescription || user.seller.description;
        user.seller.link = req.body.sellerLink || user.seller.link;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        account: updatedUser.account,
        username: updatedUser.username,
        name: updatedUser.name,
        surname: updatedUser.surname,
        cf: updatedUser.cf,
        birthday: user.birthday,
        birthplace: updatedUser.birthplace,
        city: updatedUser.city,
        gender: updatedUser.gender,
        email: updatedUser.email,
        phone: updatedUser.phone,
        referer: updatedUser.referer,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        hasAd: updatedUser.hasAd,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.account = req.body.account || user.account;
      user.name = req.body.name || user.name;
      user.surname = req.body.surname || user.surname;
      user.username = req.body.username || user.username;
      user.gender = req.body.gender || user.gender;
      user.cf = req.body.cf || user.cf;
      user.email = req.body.email || user.email;
      user.city = req.body.city || user.city;
      user.zipCode = req.body.zipCode || user.zipCode;
      user.phone = req.body.phone || user.phone;
      user.referer = req.body.referer || user.referer;
      user.isSeller = req.body.referer || user.isSeller;
      user.hasAd = req.body.hasAd || user.hasAd;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        referer: updatedUser.referer,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        hasAd: updatedUser.hasAd,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      // TODO: Enable Admin
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/upgrade/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user.hasAd) {
      user.hasAd = true;
      const upgradedUser = await user.save();
      res.send({
        _id: upgradedUser._id,
        account: upgradedUser.account,
        username: upgradedUser.username,
        name: upgradedUser.name,
        surname: upgradedUser.surname,
        birthday: upgradedUser.birthday,
        birthplace: upgradedUser.birthplace,
        gender: upgradedUser.gender,
        cf: upgradedUser.cf,
        city: upgradedUser.city,
        zipCode: upgradedUser.zipCode,
        phone: upgradedUser.phone,
        email: upgradedUser.email,
        referer: upgradedUser.referer,
        isAdmin: upgradedUser.isAdmin,
        isSeller: upgradedUser.isSeller,
        hasAd: upgradedUser.hasAd,
        token: generateToken(user),
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/password-recovery',
  expressAsyncHandler(async (req, res) => {
    const data = await User.find({ email: req.body.email });
    if (data[0].email === req.body.email) {
      res.send({email: true, loading: false })
      data[0].recoveryPasswordId = Web3.utils.keccak256(data[0].password)
      let recipient = msgPasswordRecovery(data[0].email, data[0].recoveryPasswordId)
      sgMail.send(recipient)
        .then(() => {
          const newUserState =  async () => { await data[0].save() }
          newUserState()
        })
        .catch((error) => {
          console.error(error)
        })
      return
    } else {
      res.status(404).send({ message: 'Email Not Found' })
    } 
  })
);

userRouter.post(
  '/password-replacement',
  expressAsyncHandler(async (req, res) => {
    const user = await User.find({ recoveryPasswordId: req.body.id });
    if (user[0].recoveryPasswordId === req.body.id) {
      user[0].password = bcrypt.hashSync(req.body.newData, 8)
      user[0].recoveryPasswordId = ''
      let recipient = msgPasswordReplaced(user[0].email, user[0].username)
      sgMail.send(recipient)
        .then(() => {
          const newUserState =  async () => { await user[0].save() }
          newUserState()
          res.send({password_replacement: true })
        })
        .catch((error) => {
          console.error(error)
          res.status(404).send({password_replacement: false, loading: false, message: 'Password non sostituita' })
        })
      return
    } else {
      res.status(404).send({ message: 'Process has failed' })
    } 
  })
);

userRouter.get(
  '/newsletter/:email',
  expressAsyncHandler(async (req, res) => {
    const email = req.url.split('/')[2]
    let subscriber = await Newsletter.findOne({ email })
    return subscriber.verified
  })
)

userRouter.post(
  '/newsletter',
  expressAsyncHandler(async (req, res) => {
    let subscriber = await Newsletter.findOne({ email: req.body.email })
    if (!subscriber) {
      let recipient = newsletterWelcome( req.body.email, req.body.name)
      subscriber = new Newsletter({
        name: req.body.name,
        email: req.body.email,
        verified: false
      })
      const createdSubscriber = await subscriber.save()
      sgMail.send(recipient)
        .then(() => {
          res.send({ subscriber: true })
        })
        .catch((error) => {
          console.error(error)
          res.status(404).send({ loading: false, message: 'Error from SendGrid' })
        })
      return
    } else if (subscriber.email && !subscriber.verified) {
      res.status(404).send({ message: 'Email already subscribed but not verified' })
    } else if (subscriber.email && subscriber.verified) {
      res.status(404).send({ message: 'Email already subscribed' })
    } else {
      res.status(404).send({ message: 'Process has failed' })
    }
  })
)

userRouter.post(
  '/newsletterVerify',
  expressAsyncHandler(async (req, res) => {
    let subscriber = await Newsletter.find({ email: req.body.email })
    if (subscriber){
      subscriber[0].verified = true
      subscriber[0].save()
      res.status(200).send({ name: subscriber })
      return 
    } else if (subscriber.email && !subscriber.verified) {
      res.status(404).send({ message: 'Email already subscribed but not verified' })
    } else if (subscriber.email && subscriber.verified) {
      res.status(404).send({ message: 'Email already subscribed' })
    } else {
      res.status(404).send({ message: 'Process has failed' })
    }
  })
)

userRouter.post(
  '/newsletterUpdate',
  expressAsyncHandler(async (req, res) => {
    let subscriber = await Newsletter.find({ email: req.body.email })
    if(subscriber[0]) {
      subscriber[0].verified = !subscriber[0].verified
      subscriber[0].save()
    } else {
      subscriber = new Newsletter({
        name: req.body.username,
        email: req.body.email,
        verified: true
      })
      await subscriber.save()
    }
    res.status(200).send('yeah!')
  })
)

export default userRouter;
