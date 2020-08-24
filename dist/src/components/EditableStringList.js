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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableStringList = void 0;
var react_1 = __importDefault(require("react"));
var lens = __importStar(require("../lens"));
exports.EditableStringList = function (p) { return react_1.default.createElement("div", { className: "content" },
    react_1.default.createElement("div", null,
        p.strings.map(function (s, i) { return react_1.default.createElement("div", { key: i }, p.editing ?
            react_1.default.createElement("input", { type: "text", value: s, onChange: function (e) { return p.onEdit(lens.atL(i).set(p.strings, e.target.value)); } })
            :
                s); }),
        p.editing ? react_1.default.createElement("i", { onClick: function (e) { return p.onEdit(__spreadArrays(p.strings, [""])); } }, "add") : react_1.default.createElement("span", null)),
    react_1.default.createElement("i", { onClick: function (e) { return p.onToggleEdit(); } },
        p.editing ? 'tick' : 'edit',
        " ")); };
