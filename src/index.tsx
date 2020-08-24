import { configureFetch, Environment, AuthData } from "@meeco/sdk";

import * as _ from "./constants";

import * as userFactory from "./userFactory";

import * as itemFactory from "./itemFactory";

import * as templateFactory from "./templateFactory";

import { hideElement, showElement } from "./appService";
import "./styles.scss";

configureFetch(window.fetch);

// _.$("createAccount").addEventListener("click", () => {
//   hideElement(_.login);
//   showElement(_.signup);
// });
// _.$("generate").addEventListener("click", userFactory.getUsername);
// _.$("new-user-login").addEventListener("click", itemFactory.getAllItems);
// _.$("getAccount").addEventListener("click", userFactory.fetchUserData);
// _.$("addItem").addEventListener("click", templateFactory.getTemplates);
// _.$("createCard").addEventListener("click", itemFactory.createItem);
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

let initialAuthData = null; // JSON.parse(window.localStorage.getItem('savedAuth'));


ReactDOM.render(<App 
  date={new Date()}
  env={environment} 
  savedAuthData={initialAuthData ? initialAuthData as AuthData : undefined} />, 
  document.getElementById("app"));