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
Object.defineProperty(exports, "__esModule", { value: true });
var lens_1 = require("../src/lens");
var state = __importStar(require("../src/state"));
var chai_1 = require("chai");
var sdk_1 = require("@meeco/sdk");
var lens_2 = require("../src/lens");
var blankAuth = new sdk_1.AuthData({
    data_encryption_key: sdk_1.EncryptionKey.fromRaw(''),
    key_encryption_key: sdk_1.EncryptionKey.fromRaw(''),
    keystore_access_token: '',
    passphrase_derived_key: sdk_1.EncryptionKey.fromRaw(''),
    secret: '',
    vault_access_token: ''
});
var blankMedInfo = {
    conditions: [],
    medications: [],
    doctorContact: {
        kind: 'doctor',
        name: "",
        address: {
            line1: "",
            postcode: "",
            city: "",
            country: "",
        }
    },
    personalContact: {
        kind: 'personal',
        name: "",
        relationship: ""
    }
};
describe('State modifications', function () {
    it('Edit doctor name', function () {
        var initial = state.initialLoggedInState(blankAuth, blankMedInfo);
        var updated = lens_1.ol(state.rootDoctorContactO, state.contactNameL).setOptional(initial, "Tin");
        chai_1.expect(updated.medical.doctorContact.name).equal("Tin");
    });
    it('Edit editing doctor name', function () {
        var initial = state.initialLoggedInState(blankAuth, blankMedInfo);
        var updated = lens_2.modOptional(state.rootEditingDoctorO, initial, function (b) { return !b; });
        chai_1.expect(updated.medical.editingDoctor).equal(true);
    });
    it('Edit contact relationship', function () {
        var initial = state.initialLoggedInState(blankAuth, blankMedInfo);
        var updated = lens_1.ol(state.rootPersonalContactO, state.personalRelationshipL).setOptional(initial, "Wife");
        chai_1.expect(updated.medical.personalContact.relationship).equal("Wife");
    });
});
