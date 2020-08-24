"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("@meeco/sdk");
var _ = __importStar(require("./constants"));
require("./styles.scss");
sdk_1.configureFetch(window.fetch);
// _.$("createAccount").addEventListener("click", () => {
//   hideElement(_.login);
//   showElement(_.signup);
// });
// _.$("generate").addEventListener("click", userFactory.getUsername);
// _.$("new-user-login").addEventListener("click", itemFactory.getAllItems);
// _.$("getAccount").addEventListener("click", userFactory.fetchUserData);
// _.$("addItem").addEventListener("click", templateFactory.getTemplates);
// _.$("createCard").addEventListener("click", itemFactory.createItem);
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var App_1 = require("./components/App");
var environment = new sdk_1.Environment({
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
var initialAuthData = null; // JSON.parse(window.localStorage.getItem('savedAuth'));
react_dom_1.default.render(react_1.default.createElement(App_1.App, { env: environment, savedAuthData: initialAuthData ? initialAuthData : undefined }), document.getElementById("app"));
