"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
var react_1 = __importDefault(require("react")); // we need this to make JSX compile
exports.Login = function (p) { return react_1.default.createElement("div", null,
    react_1.default.createElement("h2", null, "Log In"),
    react_1.default.createElement("label", { htmlFor: "secret" }, "Secret"),
    react_1.default.createElement("input", { name: "secret", id: "secret", type: "text", placeholder: "Secret", value: p.secret, onChange: function (e) { return p.onUpdate(e.target.value, p.passphrase); } }),
    react_1.default.createElement("label", { htmlFor: "passphrase" }, "Passphrase"),
    react_1.default.createElement("input", { name: "passphrase", id: "passphrase", type: "password", placeholder: "passphrase", value: p.passphrase, onChange: function (e) { return p.onUpdate(p.secret, e.target.value); } }),
    p.lastLoginFailed ? react_1.default.createElement("p", null, "Incorrect Login. Plase try again") : react_1.default.createElement("span", null),
    react_1.default.createElement("button", { className: "primary large", onClick: function (e) { return p.onLoginClicked(); } }, "Log In")); };
