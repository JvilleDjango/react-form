import React from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

import { setRecaptchaResponse } from '../../redux/form/form.actions'

const SITE_KEY = "6LcjOmkaAAAAAPq-Ti7EtfJEWUL6jkMWLZLX5P_P";
const RECAPTCHA_SERVER_KEY = process.env.REACT_APP_RECAPTCHA_SERVER_KEY;


const Recaptcha = ({setRecaptchaResponse}) => {

  const onChange = (value) => {

    axios({
      url: 'https://api.cloud.devops.intellectivelab.com/v1/recaptcha',
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      crossDomain: true,
      method: 'POST',
      data: {
        response: value
      }
    }).then(response => {
      // console.log('recaptcha ', response)
      setRecaptchaResponse(response.data)
    })
      .catch(error => {
        console.log(JSON.parse(error))
      })
  }

  return <ReCAPTCHA sitekey={SITE_KEY} onChange={onChange} />
}

const mapDispatchToProps = dispatch => ({
  setRecaptchaResponse: recaptchaResponse => dispatch(setRecaptchaResponse(recaptchaResponse))
})

export default connect(null, mapDispatchToProps)(Recaptcha);