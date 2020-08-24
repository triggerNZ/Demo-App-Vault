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
exports.getItem = exports.showItemDetail = exports.displayAllItems = exports.getAllItems = exports.createItem = exports.showItemForm = void 0;
var sdk_1 = require("@meeco/sdk");
var _ = __importStar(require("./constants"));
var appService_1 = require("./appService");
// //create Item
// First we need to display the form to create an item
exports.showItemForm = function () {
    appService_1.hideElement(_.itemTemplate);
    appService_1.hideElement(_.itemShow);
    appService_1.showElement(_.itemFormContainer);
    _.form.innerHTML = "\n  <h4>" + appService_1.STATE.template.item_template.label + "</h4>\n  <label for=\"item-label\">Item name</label>\n  <input name=\"item-label\" id=\"item-label-value\" type=\"text\" />\n  <hr>";
    appService_1.STATE.template.slots.forEach(function (slot) {
        _.form.innerHTML += "\n    <label for=\"" + slot.label + "\">" + slot.label + "</label>\n    <input id=\"" + slot.name + "\" name=\"" + slot.label + "\" type=\"text\"/>";
    });
};
// Creating the item
function createItem() {
    return __awaiter(this, void 0, void 0, function () {
        var config, item, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = {
                        template_name: appService_1.STATE.template.item_template.name,
                        item: {
                            label: _.$get("item-label-value"),
                        },
                        slots: [],
                    };
                    appService_1.STATE.template.slots.forEach(function (slot) {
                        config.slots.push({
                            name: slot.name,
                            value: _.$get(slot.name),
                        });
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, new sdk_1.ItemService(appService_1.environment, appService_1.log).create(appService_1.STATE.user.vault_access_token, appService_1.STATE.user.data_encryption_key, config)];
                case 2:
                    item = _a.sent();
                    return [4 /*yield*/, getAllItems()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createItem = createItem;
// // Get all items
// Call the API to retrieve the items
function getAllItems() {
    return __awaiter(this, void 0, void 0, function () {
        var items, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appService_1.hideElement(_.loading);
                    appService_1.hideElement(_.welcome);
                    appService_1.hideElement(_.header);
                    appService_1.showElement(_.navbar);
                    appService_1.showElement(_.itemList);
                    appService_1.showElement(_.dashboard);
                    _.sidebar.style.justifyContent = "flex-start";
                    appService_1.hideElement(_.itemFormContainer);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new sdk_1.ItemService(appService_1.environment, appService_1.log).list(appService_1.STATE.user.vault_access_token)];
                case 2:
                    items = _a.sent();
                    appService_1.STATE.items = items.items;
                    displayAllItems();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAllItems = getAllItems;
// Display the items on the page
function displayAllItems() {
    appService_1.showElement(_.itemList);
    appService_1.hideElement(_.itemShow);
    appService_1.hideElement(_.itemFormContainer);
    _.cardList.innerHTML = "";
    appService_1.STATE.items.forEach(function (item) {
        console.log(item.item_template_label);
        var itemIcon;
        switch (item.item_template_label) {
            case "Password":
                itemIcon = "vault";
                break;
            case "Medical":
                itemIcon = "notes";
                break;
            case "Membership or subscription":
                itemIcon = "id";
                break;
            case "Custom":
                itemIcon = "template";
                break;
            default:
                itemIcon = "item";
        }
        var card = document.createElement("div");
        card.className = "card";
        card.setAttribute("id", "" + item.label);
        card.innerHTML = "\n      <div class=\"content\">\n        <div class=\"icon\"><i>" + itemIcon + "</i></div>\n        <p class=\"card-label\">" + item.label + "</p>\n      </div>";
        _.cardList.appendChild(card);
        _.$(item.label).addEventListener("click", function () {
            showItemDetail(item.label);
        });
    });
}
exports.displayAllItems = displayAllItems;
// Adding a click function to each item card
function showItemDetail(label) {
    appService_1.STATE.items.forEach(function (item) {
        if (item.label === label) {
            getItem(item.id);
        }
    });
}
exports.showItemDetail = showItemDetail;
// // Get a single item
// Calling the API to retrieve single API
function getItem(id) {
    return __awaiter(this, void 0, void 0, function () {
        var item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sdk_1.ItemService(appService_1.environment, appService_1.log).get(id, appService_1.STATE.user.vault_access_token, appService_1.STATE.user.data_encryption_key)];
                case 1:
                    item = _a.sent();
                    displayItem(item);
                    return [2 /*return*/];
            }
        });
    });
}
exports.getItem = getItem;
// Display that single item
function displayItem(item) {
    appService_1.showElement(_.active);
    appService_1.hideElement(_.itemFormContainer);
    appService_1.hideElement(_.itemTemplate);
    appService_1.showElement(_.itemShow);
    _.$("item-heading").innerHTML = item.item.label;
    _.$("item-detail").innerHTML = "";
    item.slots.forEach(function (slot) {
        if (slot.value !== "") {
            slot.label === "Tags"
                ? (_.$("tag-container").innerHTML = "<span class=\"tag\">" + slot.value + "</span>")
                : (_.$("item-detail").innerHTML += "\n      <p class=\"label\">" + slot.label + "</p>\n      <p class=\"text-value\">" + slot.value + "</p><br/>");
        }
    });
    _.$("delete").addEventListener("click", function () {
        deleteItem(item.item);
    });
}
// // Delete an item
function deleteItem(item) {
    return __awaiter(this, void 0, void 0, function () {
        var service, res, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = sdk_1.vaultAPIFactory(appService_1.environment)(appService_1.STATE.user.vault_access_token)
                        .ItemApi;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.itemsIdDelete(item.id)];
                case 2:
                    res = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.log(error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
