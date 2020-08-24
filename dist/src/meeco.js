"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMedicalInfo = exports.createMedicalInfo = exports.template = exports.TEMPLATE_NAME = void 0;
exports.TEMPLATE_NAME = "health_info_4";
exports.template = {
    name: exports.TEMPLATE_NAME,
    label: "Health Info",
    slots_attributes: [
        {
            label: "doctorContact.name",
            slot_type_name: "note_text"
        },
        {
            label: "doctorContact.address.line1",
            slot_type_name: "note_text"
        },
        {
            label: "doctorContact.address.line2",
            slot_type_name: "note_text"
        },
        {
            label: "doctorContact.address.city",
            slot_type_name: "note_text"
        },
        {
            label: "doctorContact.address.postcode",
            slot_type_name: "note_text"
        },
        {
            label: "doctorContact.address.country",
            slot_type_name: "note_text"
        },
        {
            label: "personalContact.name",
            slot_type_name: "note_text"
        },
        {
            label: "personalContact.relationship",
            slot_type_name: "note_text"
        }
    ]
};
function createMedicalInfo(templateName, med) {
    return {
        template_name: templateName,
        slots: [
            {
                name: 'doctorContact.name',
                value: med.doctorContact.name
            },
            {
                name: 'doctorContact.address.line1',
                value: med.doctorContact.address.line1
            },
            {
                name: 'doctorContact.address.line2',
                value: med.doctorContact.address.line2
            },
            {
                name: 'doctorContact.address.city',
                value: med.doctorContact.address.city
            },
            {
                name: 'doctorContact.address.postcode',
                value: med.doctorContact.address.postcode
            },
            {
                name: 'doctorContact.address.country',
                value: med.doctorContact.address.country
            },
            {
                name: 'personalContact.name',
                value: med.personalContact.name
            },
            {
                name: 'personalContact.relationship',
                value: med.personalContact.relationship
            }
        ],
        item: {
            label: "Health Information"
        }
    };
}
exports.createMedicalInfo = createMedicalInfo;
function loadMedicalInfo(slots) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var doctorName = (_a = slots.filter(function (it) { return it.name === "doctorContact.name"; })[0]) === null || _a === void 0 ? void 0 : _a.value;
    var doctorAddressLine1 = (_b = slots.filter(function (it) { return it.name === "doctorContact.address.line1"; })[0]) === null || _b === void 0 ? void 0 : _b.value;
    var doctorAddressLine2 = (_c = slots.filter(function (it) { return it.name === "doctorContact.address.line2"; })[0]) === null || _c === void 0 ? void 0 : _c.value;
    var doctorAddressCity = (_d = slots.filter(function (it) { return it.name === "doctorContact.address.city"; })[0]) === null || _d === void 0 ? void 0 : _d.value;
    var doctorAddressPostcode = (_e = slots.filter(function (it) { return it.name === "doctorContact.address.postcode"; })[0]) === null || _e === void 0 ? void 0 : _e.value;
    var doctorAddressCountry = (_f = slots.filter(function (it) { return it.name === "doctorContact.address.country"; })[0]) === null || _f === void 0 ? void 0 : _f.value;
    var contactName = (_g = slots.filter(function (it) { return it.name === "personalContact.name"; })[0]) === null || _g === void 0 ? void 0 : _g.value;
    var contactRelationship = (_h = slots.filter(function (it) { return it.name === "personalContact.relationship"; })[0]) === null || _h === void 0 ? void 0 : _h.value;
    return {
        doctorContact: {
            kind: "doctor",
            name: doctorName || "",
            address: {
                line1: doctorAddressLine1 || "",
                line2: doctorAddressLine2,
                city: doctorAddressCity || "",
                postcode: doctorAddressPostcode || "",
                country: doctorAddressCountry || ""
            },
        },
        personalContact: {
            kind: "personal",
            name: contactName || "",
            relationship: contactRelationship || ""
        },
        conditions: [],
        medications: []
    };
}
exports.loadMedicalInfo = loadMedicalInfo;
