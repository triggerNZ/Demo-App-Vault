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
exports.MedicalInformation = void 0;
var react_1 = __importDefault(require("react"));
var state = __importStar(require("../state"));
var EditableStringList_1 = require("./EditableStringList");
var ContactInformation = function (p) { return react_1.default.createElement("div", { className: "card" },
    react_1.default.createElement("div", { className: "content" },
        react_1.default.createElement("span", { className: "avatar" }),
        react_1.default.createElement("div", null,
            react_1.default.createElement("h5", null, p.editing ?
                react_1.default.createElement("input", { type: "text", value: p.contact.name, onChange: function (e) { return p.onEditContact(state.contactNameL.set(p.contact, e.target.value)); } })
                :
                    p.contact.name),
            react_1.default.createElement("p", null, p.contact.kind == 'doctor' ?
                state.singleLineAddress(p.contact.address) :
                p.editing ?
                    react_1.default.createElement("input", { type: "text", value: p.contact.relationship, onChange: function (e) { p.onEditContact(state.contactRelationshipO.setOptional(p.contact, e.target.value)); } })
                    :
                        p.contact.relationship)),
        react_1.default.createElement("i", { onClick: function (e) { return p.onToggleEdit(); } },
            p.editing ? 'tick' : 'edit',
            " "))); };
exports.MedicalInformation = function (p) {
    return (react_1.default.createElement("div", { id: "header" },
        react_1.default.createElement("div", { className: "active" },
            react_1.default.createElement("h3", null, "Medical"),
            react_1.default.createElement("div", { className: "advanced" },
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement("div", { className: "content red-shade" },
                        react_1.default.createElement("div", { className: "icon" }, "add-circled"),
                        react_1.default.createElement("p", { className: "card-label" }, "Medical Information")),
                    react_1.default.createElement("div", { className: "content" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h5", null, "Conditions"),
                            react_1.default.createElement(EditableStringList_1.EditableStringList, { strings: p.info.conditions, editing: p.editingConditions, onEdit: function (ss) { return p.onConditionsEdit(ss); }, onToggleEdit: p.toggleEditingConditions }))),
                    react_1.default.createElement("div", { className: "content" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h5", null, "Medications"),
                            react_1.default.createElement(EditableStringList_1.EditableStringList, { strings: p.info.medications, editing: p.editingMedications, onEdit: function (ss) { return p.onMedicationsEdit(ss); }, onToggleEdit: p.toggleEditingMedications }))))),
            react_1.default.createElement("h3", null, "Personal Contact"),
            react_1.default.createElement(ContactInformation, { contact: p.info.personalContact, onEditContact: p.onPersonalContactEdit, editing: p.editingPersonal, onToggleEdit: p.toggleEditingPersonal }),
            react_1.default.createElement("h3", null, "Doctor Contact"),
            react_1.default.createElement(ContactInformation, { contact: p.info.doctorContact, onEditContact: p.onDoctorContactEdit, editing: p.editingDoctor, onToggleEdit: p.toggleEditingDoctor }))));
};
