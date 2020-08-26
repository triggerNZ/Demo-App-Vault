import { configureFetch, Environment, AuthData } from "@meeco/sdk";

import * as _ from "./constants";

import * as userFactory from "./userFactory";

import * as itemFactory from "./itemFactory";

import * as templateFactory from "./templateFactory";

import { hideElement, showElement } from "./appService";
import "./styles.scss";

configureFetch(window.fetch);

import React    from 'react';
import ReactDOM from 'react-dom';

import {App} from './components/App'

let environment = new Environment({
    vault: {
      url: _.VAULT_URL,
      subscription_key: _.SUB_KEY,
    },
    keystore: {
      url: _.KEYSTORE_URL,
      subscription_key: _.SUB_KEY,
      provider_api_key: "",
    },
  });

let initialAuthData = undefined; // JSON.parse(window.localStorage.getItem('savedAuth'));


ReactDOM.render(<App
  env={environment} 
  savedAuthData={initialAuthData ? new AuthData(initialAuthData) : undefined} />, 
  document.getElementById("app"));