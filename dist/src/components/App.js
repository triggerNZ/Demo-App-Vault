"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var react_1 = __importStar(require("react")); // we need this to make JSX compile
var state = __importStar(require("../state"));
var MedicalInformation_1 = require("./MedicalInformation");
var lens_1 = require("../lens");
var sdk_1 = require("@meeco/sdk");
var Login_1 = require("./Login");
var meeco = __importStar(require("../meeco"));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.env = props.env;
        console.log('App loaded');
        if (!props.savedAuthData) {
            _this.state = state.notLoggedInState(false);
        }
        else {
            _this.state = state.loadingDataState(props.savedAuthData);
            _this.loadData(props.savedAuthData);
        }
        return _this;
    }
    App.prototype.render = function () {
        var _this = this;
        switch (this.state.kind) {
            case "logged-in":
                var medical_1 = this.state.medical;
                var auth_1 = this.state.authData;
                return react_1.default.createElement("div", null,
                    react_1.default.createElement(MedicalInformation_1.MedicalInformation, { info: medical_1, onDoctorContactEdit: function (s) { return _this.modState(function (st) { return state.rootDoctorContactO.setOptional(st, s); }); }, editingDoctor: medical_1.editingDoctor, toggleEditingDoctor: function () { return _this.modState(function (st) { return lens_1.modOptional(state.rootEditingDoctorO, st, function (b) { return !b; }); }); }, onPersonalContactEdit: function (s) { return _this.modState(function (st) { return state.rootPersonalContactO.setOptional(st, s); }); }, editingPersonal: medical_1.editingPersonal, toggleEditingPersonal: function () { return _this.modState(function (st) { return lens_1.modOptional(state.rootEditingPersonalO, st, function (b) { return !b; }); }); }, editingMedications: medical_1.editingMedications, onMedicationsEdit: function (ms) { return _this.modState(function (st) { return state.rootMedicationsO.setOptional(st, ms); }); }, toggleEditingMedications: function () { return _this.modState(function (st) { return lens_1.modOptional(state.rootEditingMedicationsO, st, function (b) { return !b; }); }); }, editingConditions: medical_1.editingConditions, onConditionsEdit: function (cs) { return _this.modState(function (st) { return state.rootConditionsO.setOptional(st, cs); }); }, toggleEditingConditions: function () { return _this.modState(function (st) { return lens_1.modOptional(state.rootEditingConditionsO, st, function (b) { return !b; }); }); } }),
                    react_1.default.createElement("button", { className: "primary large", onClick: function () { return _this.persistState(auth_1, medical_1); } }, "Save"));
            case "logging-in":
                return react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null),
                    react_1.default.createElement("h5", null, "Logging in. Please wait a moment..."));
            case "loading-data":
                return react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null),
                    react_1.default.createElement("h5", null, "Loading data. Please wait a moment..."));
            case "not-logged-in": {
                var secret_1 = this.state.secret;
                var passphrase_1 = this.state.passphrase;
                return react_1.default.createElement(Login_1.Login, { lastLoginFailed: this.state.lastLoginFailed, secret: secret_1, passphrase: this.state.passphrase, onUpdate: function (s, p) { return _this.setState(__assign(__assign({}, _this.state), { secret: s, passphrase: p })); }, onLoginClicked: function () { return _this.doLogin(secret_1, passphrase_1); } });
            }
        }
    };
    App.prototype.persistState = function (auth, med) {
        return __awaiter(this, void 0, void 0, function () {
            var vaf, itemApi, templateApi, itemService, templates, existingTemplate, healthInfoTemplate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vaf = sdk_1.vaultAPIFactory(this.env)(auth);
                        itemApi = vaf.ItemApi;
                        templateApi = vaf.ItemTemplateApi;
                        itemService = new sdk_1.ItemService(this.env, logger);
                        return [4 /*yield*/, templateApi.itemTemplatesGet()];
                    case 1:
                        templates = _a.sent();
                        existingTemplate = templates.item_templates.filter(function (t) { return t.name === meeco.TEMPLATE_NAME; });
                        healthInfoTemplate = existingTemplate[0];
                        if (!!healthInfoTemplate) return [3 /*break*/, 3];
                        return [4 /*yield*/, templateApi.itemTemplatesPost(meeco.template)];
                    case 2:
                        healthInfoTemplate = (_a.sent()).item_template;
                        console.log('newTemplate', healthInfoTemplate);
                        return [3 /*break*/, 4];
                    case 3:
                        console.log('template already exists', healthInfoTemplate);
                        _a.label = 4;
                    case 4: return [4 /*yield*/, itemService.create(auth.vault_access_token, auth.data_encryption_key, meeco.createMedicalInfo(healthInfoTemplate.name, med))];
                    case 5:
                        _a.sent();
                        console.log("successfully saved");
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.modState = function (fn) {
        console.log("state before", this.state);
        this.setState(fn(this.state));
        console.log("state after", fn(this.state));
    };
    App.prototype.doLogin = function (secret, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var usersService, authData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState(state.loggingInState());
                        usersService = new sdk_1.UserService(this.env, logger);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, usersService.get(passphrase, secret)];
                    case 2:
                        authData = _a.sent();
                        console.log("Got user", authData);
                        window.localStorage.setItem('savedAuth', JSON.stringify(authData));
                        this.setState(state.loadingDataState(authData));
                        return [4 /*yield*/, this.loadData(authData)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.setState(state.notLoggedInState(true));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.loadData = function (authData) {
        return __awaiter(this, void 0, void 0, function () {
            var itemService, allItems, latestItem, actualItem, medInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        itemService = new sdk_1.ItemService(this.env, logger);
                        return [4 /*yield*/, itemService.list(authData.vault_access_token)];
                    case 1:
                        allItems = _a.sent();
                        console.log('allItems', allItems);
                        latestItem = maxBy(allItems.items.
                            filter(function (it) { return it.name === "health_information"; }), function (it) { return it.created_at.toISOString(); });
                        console.log(latestItem);
                        return [4 /*yield*/, itemService.get(latestItem.id, authData.vault_access_token, authData.data_encryption_key)];
                    case 2:
                        actualItem = _a.sent();
                        console.log(actualItem);
                        medInfo = meeco.loadMedicalInfo(actualItem.slots);
                        this.setState(state.initialLoggedInState(authData, medInfo));
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}(react_1.Component));
exports.App = App;
function maxBy(arr, compareBy) {
    if (arr.length == 0) {
        return undefined;
    }
    else {
        var max = arr[0];
        var fMax = compareBy(max);
        for (var i = 0; i < arr.length; i++) {
            if (compareBy(arr[i]) > fMax) {
                fMax = compareBy(arr[i]);
                max = arr[i];
            }
        }
        return max;
    }
}
var logger = function (msg) { return console.log(msg); };
