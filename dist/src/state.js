"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialLoggedInState = exports.loadingDataState = exports.loggingInState = exports.notLoggedInState = exports.rootMedicationsO = exports.rootConditionsO = exports.rootPersonalContactO = exports.rootDoctorContactO = exports.rootEditingPersonalO = exports.rootEditingDoctorO = exports.rootEditingMedicationsO = exports.rootEditingConditionsO = exports.rootMedicalO = exports.editingConditionsL = exports.editingMedicationsL = exports.editingPersonalL = exports.editingDoctorL = exports.contactRelationshipO = exports.personalRelationshipL = exports.contactNameL = exports.stateMedicationsL = exports.stateConditionsL = exports.statePersonalContactL = exports.stateDoctorContactL = exports.singleLineAddress = void 0;
var lens_1 = require("./lens");
;
;
function singleLineAddress(a) {
    return a.line1 + ", " + (a.line2 ? (a.line2 + ", ") : "") + a.postcode + ", " + a.city + ", " + a.country;
}
exports.singleLineAddress = singleLineAddress;
exports.stateDoctorContactL = {
    get: function (s) { return s.doctorContact; },
    set: function (s, newContact) { return (__assign(__assign({}, s), { doctorContact: newContact })); }
};
exports.statePersonalContactL = {
    get: function (s) { return s.personalContact; },
    set: function (s, newContact) { return (__assign(__assign({}, s), { personalContact: newContact })); }
};
exports.stateConditionsL = {
    get: function (s) { return s.conditions; },
    set: function (s, cs) { return (__assign(__assign({}, s), { conditions: cs })); }
};
exports.stateMedicationsL = {
    get: function (s) { return s.medications; },
    set: function (s, ms) { return (__assign(__assign({}, s), { medications: ms })); }
};
exports.contactNameL = {
    get: function (c) { return c.name; },
    set: function (c, newName) { return (__assign(__assign({}, c), { name: newName })); }
};
exports.personalRelationshipL = {
    get: function (pc) { return pc.relationship; },
    set: function (pc, r) { return (__assign(__assign({}, pc), { relationship: r })); }
};
exports.contactRelationshipO = {
    get: function (c) {
        switch (c.kind) {
            case "doctor":
                return undefined;
            case "personal":
                return c.relationship;
        }
    },
    setOptional: function (c, r) {
        switch (c.kind) {
            case "doctor":
                return c;
            case "personal":
                return __assign(__assign({}, c), { relationship: r });
        }
    }
};
exports.editingDoctorL = {
    get: function (s) { return s.editingDoctor; },
    set: function (s, ed) { return (__assign(__assign({}, s), { editingDoctor: ed })); }
};
exports.editingPersonalL = {
    get: function (s) { return s.editingPersonal; },
    set: function (s, ed) { return (__assign(__assign({}, s), { editingPersonal: ed })); }
};
exports.editingMedicationsL = {
    get: function (s) { return s.editingMedications; },
    set: function (s, ed) { return (__assign(__assign({}, s), { editingMedications: ed })); }
};
exports.editingConditionsL = {
    get: function (s) { return s.editingConditions; },
    set: function (s, ed) { return (__assign(__assign({}, s), { editingConditions: ed })); }
};
exports.rootMedicalO = {
    get: function (s) {
        switch (s.kind) {
            case "logged-in":
                return s.medical;
            case "not-logged-in":
                return undefined;
        }
    },
    setOptional: function (s, m) {
        switch (s.kind) {
            case "logged-in":
                return __assign(__assign({}, s), { medical: m });
            case "not-logged-in":
                return s;
        }
    }
};
exports.rootEditingConditionsO = lens_1.ol(exports.rootMedicalO, exports.editingConditionsL);
exports.rootEditingMedicationsO = lens_1.ol(exports.rootMedicalO, exports.editingMedicationsL);
exports.rootEditingDoctorO = lens_1.ol(exports.rootMedicalO, exports.editingDoctorL);
exports.rootEditingPersonalO = lens_1.ol(exports.rootMedicalO, exports.editingPersonalL);
exports.rootDoctorContactO = lens_1.ol(exports.rootMedicalO, exports.stateDoctorContactL);
exports.rootPersonalContactO = lens_1.ol(exports.rootMedicalO, exports.statePersonalContactL);
exports.rootConditionsO = lens_1.ol(exports.rootMedicalO, exports.stateConditionsL);
exports.rootMedicationsO = lens_1.ol(exports.rootMedicalO, exports.stateMedicationsL);
function notLoggedInState(loginError) {
    return {
        kind: "not-logged-in",
        passphrase: "",
        secret: "",
        lastLoginFailed: loginError
    };
}
exports.notLoggedInState = notLoggedInState;
function loggingInState() {
    return { kind: 'logging-in' };
}
exports.loggingInState = loggingInState;
function loadingDataState(auth) {
    return {
        kind: "loading-data",
        authData: auth
    };
}
exports.loadingDataState = loadingDataState;
function initialLoggedInState(authData, medical) {
    return {
        kind: 'logged-in',
        authData: authData,
        medical: __assign(__assign({}, medical), { kind: 'medical-info', editingConditions: false, editingDoctor: false, editingMedications: false, editingPersonal: false })
    };
}
exports.initialLoggedInState = initialLoggedInState;
