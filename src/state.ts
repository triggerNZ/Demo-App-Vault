import {Lens, ol, Optional} from './lens';
import { AuthData } from '@meeco/sdk';
import {Invitation, Share, Connection, MeResponse} from '@meeco/vault-api-sdk'

export type AppState = NotLoggedIn | LoadingData | LoggingIn | LoggedIn;

export interface NotLoggedIn {
    kind: "not-logged-in";
    passphrase: string;
    secret: string;
    lastLoginFailed: boolean;
}

export enum CurrentFeeling {
    Fine, BitSick, VerySick
}

export enum CurrentTab {
    Medical,
    FeelingToday,
    CovidDiary,
    Invite,
    Sharing
}

export interface AcceptInvite {
    name: string;
    token: string;
}

export interface LoggedIn {
    kind: "logged-in";
    medical: MedicalInformationState;
    authData: AuthData;
    user: MeResponse,
    connections: ConnectionWithName[];
    sharedWithMe: Record<ConnectionId, MedicalInformation>;
    sharedWithThem: ConnectionId[],
    currentTab: CurrentTab;
    currentFeeling?: CurrentFeeling;
    covidDiary: CovidDiary;
    newInviteName: string;
    acceptInvite: AcceptInvite,
    sentInvite?: Invitation
};

export type CovidDiary = 
    {date: Date, feeling: CurrentFeeling}[];

export interface LoggingIn {
    kind: "logging-in";
}

export interface LoadingData {
    kind: "loading-data";
    authData: AuthData;
}

export interface MedicalInformation {
    itemId?: string;
    name: string;
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
    editingConditions: boolean,
    editingName: boolean
}

export type Condition  = string & {readonly __tag: unique symbol}
export type Medication = string & {readonly __tag: unique symbol}
export type Phone      = string & {readonly __tag: unique symbol}

export interface ConnectionWithName {
    name: string;
    connection: Connection;
}

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

export const contactAddressO: Optional<Contact, Address> = {
    get: (c) => {
        switch(c.kind) {
            case 'doctor': 
                return c.address;
            case 'personal':
                return undefined;
        }
    },
    setOptional: (c, a) => {
        switch(c.kind) {
            case 'doctor': 
                return {...c, address: a}
            case 'personal':
                return c;
        }
    }
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

export const addressLine1L: Lens<Address, string> = {
    get: (a) => a.line1,
    set: (a, s) => ({...a, line1: s})
}

export const addressLine2L: Lens<Address, string | undefined> = {
    get: (a) => a.line2,
    set: (a, s) => ({...a, line2: s})
}

export const addressPostcodeL: Lens<Address, string> = {
    get: (a) => a.postcode,
    set: (a, s) => ({...a, postcode: s})
}

export const addressCityL: Lens<Address, string> = {
    get: (a) => a.city,
    set: (a, s) => ({...a, city: s})
}

export const addressCountryL: Lens<Address, string> = {
    get: (a) => a.country,
    set: (a, s) => ({...a, country: s})
}

export let stateDoctorContactL: Lens<MedicalInformationState, DoctorContact> = {
    get: (s) => s.doctorContact,
    set: (s, newContact) => ({...s, doctorContact: newContact})
}

export let stateNameL: Lens<MedicalInformationState, string> = {
    get: (s) => s.name,
    set: (s, newName) => ({...s, name: newName})
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

export let editingNameL: Lens<MedicalInformationState, boolean> = {
    get: (s) => s.editingName,
    set: (s, ed) => ({...s, editingName: ed})
}

export let rootLoggedInO: Optional<AppState, LoggedIn> = {
    get: (s) => {
        switch (s.kind) {
            case "logged-in":
                return s;
            case "not-logged-in":
                return undefined;    
        }
    },

    setOptional: (s, m) => {
        switch (s.kind) {
            case "logged-in":
                return m
            case "not-logged-in":
                return s    
        }
    }
}

export let loggedInMedicalL: Lens<LoggedIn, MedicalInformationState> = {
    get: (s) => s.medical,
    set: (s, m) => ({...s, medical: m})
}

export let loggedInSentInviteL: Lens<LoggedIn, Invitation | undefined> = {
    get: (s) => s.sentInvite,
    set: (s, i) => ({...s, sentInvite: i})
}

export let loggedInCurrentTabL: Lens<LoggedIn, CurrentTab> = {
    get: (s) => s.currentTab,
    set: (s, t) => ({...s, currentTab: t})
}

export let loggedInNewInviteNameL: Lens<LoggedIn, string> = {
    get: (s) => s.newInviteName,
    set: (s, t) => ({...s, newInviteName: t})
}

export let loggedInAcceptInviteL: Lens<LoggedIn, AcceptInvite> = {
    get: (s) => s.acceptInvite,
    set: (s, t) => ({...s, acceptInvite: t})
}

export let loggedInCurrentFeeling: Lens<LoggedIn, CurrentFeeling> = {
    get: (s) => s.currentFeeling,
    set: (s, f) => ({...s, currentFeeling: f})
}

export let rootNewInviteNameO = ol(rootLoggedInO, loggedInNewInviteNameL)
export let rootCurrentInviteO = ol(rootLoggedInO, loggedInAcceptInviteL)
export let rootMedicalO = ol(rootLoggedInO, loggedInMedicalL)
export let rootCurrentTabO = ol(rootLoggedInO, loggedInCurrentTabL)
export let rootCurrentFeelingO = ol(rootLoggedInO, loggedInCurrentFeeling)
export let rootNameO = ol(rootMedicalO, stateNameL);

export let rootEditingConditionsO = ol(rootMedicalO, editingConditionsL)
export let rootEditingNameO = ol(rootMedicalO, editingNameL)
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

export function initialLoggedInState(
    authData: AuthData, 
    user: MeResponse,
    med: MedicalInformation | undefined, 
    diary: CovidDiary | undefined,
    connections: ConnectionWithName[] | undefined,
    sharedWithMe: Record<ConnectionId, MedicalInformation>,
    sharedWithThem: ConnectionId[]
    ): LoggedIn {
    return {
        kind: 'logged-in',
        authData,
        user: user,
        connections: connections || [],
        sharedWithMe,
        sharedWithThem,
        medical: {
            ...(med || blankMedInfo), 
            kind: 'medical-info',
            editingConditions: false, 
            editingDoctor: false, 
            editingMedications: false, 
            editingPersonal: false,
            editingName: false
        },
        currentTab: CurrentTab.Medical,
        covidDiary: diary || [],
        newInviteName: '',
        acceptInvite: {
            name: '',
            token: ''
        }
    };
}

export const blankMedInfo: MedicalInformation = {
    name: "",
    conditions: [],
    medications: [],
    doctorContact: {
      kind: 'doctor',
      name: "",
      address: {
        line1:"",
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
  }

  export type ConnectionId = string;