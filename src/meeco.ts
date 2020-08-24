import * as state from './state'
import { ItemCreateData } from '@meeco/sdk'
import { NestedSlotAttributes } from "@meeco/vault-api-sdk"
import { MedicalInformation } from './components/MedicalInformation'

export const TEMPLATE_NAME = "health_info_4"

export const template = {
    name: TEMPLATE_NAME,
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
  }

export function createMedicalInfo(templateName: string, med: state.MedicalInformation): ItemCreateData {
  return  {
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
      label: `Health Information`
    }
  }
}

export function loadMedicalInfo(slots: NestedSlotAttributes[]): state.MedicalInformation {
  let doctorName = slots.filter(it => it.name === "doctorContact.name")[0]?.value;
  let doctorAddressLine1 = slots.filter(it => it.name === "doctorContact.address.line1")[0]?.value;
  let doctorAddressLine2 = slots.filter(it => it.name === "doctorContact.address.line2")[0]?.value;
  let doctorAddressCity = slots.filter(it => it.name === "doctorContact.address.city")[0]?.value;
  let doctorAddressPostcode = slots.filter(it => it.name === "doctorContact.address.postcode")[0]?.value;
  let doctorAddressCountry = slots.filter(it => it.name === "doctorContact.address.country")[0]?.value;
  

  let contactName = slots.filter(it => it.name === "personalContact.name")[0]?.value;
  let contactRelationship = slots.filter(it => it.name === "personalContact.relationship")[0]?.value;
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
    }
  } 
