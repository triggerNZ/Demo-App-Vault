import {Lens, ol, Optional} from './lens';
import { AuthData } from '@meeco/sdk';

export type AppState = NotLoggedIn | LoadingData | LoggingIn | LoggedIn;

export interface NotLoggedIn {
    kind: "not-logged-in";
    passphrase: string;
    secret: string;
    lastLoginFailed: boolean;
}

export interface LoggedIn {
    kind: "logged-in";
    medical: MedicalInformationState;
    authData: AuthData
};

export interface LoggingIn {
    kind: "logging-in";
}

export interface LoadingData {
    kind: "loading-data";
    authData: AuthData;
}

export interface MedicalInformation {
    conditions: Condition[];
    medications: Medication[];
    doctorContact: DoctorContact;
    personalContact: PersonalContact;
}

export type MedicalInformationState = MedicalInformation & { 
    kind: "medical-info",
    editingDoctor: boolean,
    editingPersonal: boolean,
    editingMedications: boolean,
    editingConditions: boolean
}

export type Condition  = string & {readonly __tag: unique symbol}
export type Medication = string & {readonly __tag: unique symbol}
export type Phone      = string & {readonly __tag: unique symbol}

export type Contact = DoctorContact | PersonalContact

export interface DoctorContact {
    kind: "doctor"
    name: string;
    address: Address;
}

export interface PersonalContact {
    kind: "personal";
    name: string;
    relationship: string;
}

export interface Address {
    line1: string,
    line2?: string,
    postcode: string,
    city: string,
    country: string
};

export function singleLineAddress(a: Address) {
    return a.line1 + ", " + (a.line2 ? (a.line2 + ", ") : "") + a.postcode + ", " + a.city + ", " + a.country;
}

export let stateDoctorContactL: Lens<MedicalInformationState, DoctorContact> = {
    get: (s) => s.doctorContact,
    set: (s, newContact) => ({...s, doctorContact: newContact})
}

export let statePersonalContactL: Lens<MedicalInformationState, PersonalContact> = {
    get: (s) => s.personalContact,
    set: (s, newContact) => ({...s, personalContact: newContact})
}

export let stateConditionsL: Lens<MedicalInformationState, Condition[]> = {
    get: (s) => s.conditions,
    set: (s, cs) => ({...s, conditions: cs})
}

export let stateMedicationsL: Lens<MedicalInformationState, Medication[]> = {
    get: (s) => s.medications,
    set: (s, ms) => ({...s, medications: ms})
}

export let contactNameL: Lens<Contact, string> = {
    get: (c) => c.name,
    set: (c, newName) => ({...c, name: newName})
}

export let personalRelationshipL : Lens<PersonalContact, string> = {
    get: (pc) => pc.relationship,
    set: (pc, r) => ({...pc, relationship: r})
}

export let contactRelationshipO: Optional<Contact, string> = {
    get: (c) => {
        switch(c.kind) {
            case "doctor":
                return undefined;
            case "personal":
                return c.relationship;
        }
    },
    setOptional: (c, r) => {
        switch(c.kind) {
            case "doctor":
                return c;
            case "personal":
                return {...c, relationship: r};
        }
    }
}

export let editingDoctorL: Lens<MedicalInformationState, boolean> = {
    get: (s) => s.editingDoctor,
    set: (s, ed) => ({...s, editingDoctor: ed})
}

export let editingPersonalL: Lens<MedicalInformationState, boolean> = {
    get: (s) => s.editingPersonal,
    set: (s, ed) => ({...s, editingPersonal: ed})
}

export let editingMedicationsL: Lens<MedicalInformationState, boolean> = {
    get: (s) => s.editingMedications,
    set: (s, ed) => ({...s, editingMedications: ed})
}

export let editingConditionsL: Lens<MedicalInformationState, boolean> = {
    get: (s) => s.editingConditions,
    set: (s, ed) => ({...s, editingConditions: ed})
}

export let rootMedicalO: Optional<AppState, MedicalInformationState> = {
    get: (s) => {
        switch (s.kind) {
            case "logged-in":
                return s.medical;
            case "not-logged-in":
                return undefined;    
        }
    },

    setOptional: (s, m) => {
        switch (s.kind) {
            case "logged-in":
                return {...s, medical: m}
            case "not-logged-in":
                return s    
        }
    }
}

export let rootEditingConditionsO = ol(rootMedicalO, editingConditionsL)
export let rootEditingMedicationsO = ol(rootMedicalO, editingMedicationsL)
export let rootEditingDoctorO = ol(rootMedicalO, editingDoctorL)
export let rootEditingPersonalO = ol(rootMedicalO, editingPersonalL)

export let rootDoctorContactO = ol(rootMedicalO, stateDoctorContactL);
export let rootPersonalContactO = ol(rootMedicalO, statePersonalContactL);

export let rootConditionsO = ol(rootMedicalO, stateConditionsL);
export let rootMedicationsO = ol(rootMedicalO, stateMedicationsL);

export function notLoggedInState(loginError: boolean): NotLoggedIn {
    return {
        kind: "not-logged-in",
        passphrase: "",
        secret: "",
        lastLoginFailed: loginError
    }
}

export function loggingInState(): LoggingIn {
    return {kind: 'logging-in'}
}

export function loadingDataState(auth: AuthData): LoadingData {
    return {
        kind: "loading-data",
        authData: auth
    }
}

export function initialLoggedInState(authData: AuthData, medical: MedicalInformation): LoggedIn {
    return {
        kind: 'logged-in',
        authData,
        medical: {
            ...medical, 
            kind: 'medical-info',
            editingConditions: false, 
            editingDoctor: false, 
            editingMedications: false, 
            editingPersonal: false}
    };
}