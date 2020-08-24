import * as state from './state'
import { ItemCreateData, ItemSlot } from '@meeco/sdk'
import { NestedSlotAttributes } from "@meeco/vault-api-sdk"

export const MEDICAL_TEMPLATE_NAME = "health_info_5"
export const MEDICAL_ITEM_NAME = MEDICAL_TEMPLATE_NAME;

export const ARRAY_SIZE = 10;

export const template = {
    name: MEDICAL_ITEM_NAME,
    label: "Health Info",

    slots_attributes: [
      {
        label: "doctorcontact_name",
        slot_type_name: "note_text"
      },
      {
        label: "doctorcontact_address_line1",
        slot_type_name: "note_text"
      },
      {
        label: "doctorcontact_address_line2",
        slot_type_name: "note_text"
      },
      {
        label: "doctorcontact_address_city",
        slot_type_name: "note_text"
      },
      {
        label: "doctorcontact_address_postcode",
        slot_type_name: "note_text"
      },
      {
        label: "doctorcontact_address_country",
        slot_type_name: "note_text"
      },
      {
        label: "personalcontact_name",
        slot_type_name: "note_text"
      },
      {
        label: "personalcontact_relationship",
        slot_type_name: "note_text"
      },
      ...(arraySlotTemplate(ARRAY_SIZE, "conditions", "note_text")),
      ...(arraySlotTemplate(ARRAY_SIZE, "medications", "note_text")),
    ]
  }

export function createMedicalInfo(templateName: string, med: state.MedicalInformation): ItemCreateData {
  return  {
    template_name: templateName,
    slots: [
      {
        name: 'doctorcontact_name',
        value: med.doctorContact.name
      },
      {
        name: 'doctorcontact_address_line1',
        value: med.doctorContact.address.line1
      },
      {
        name: 'doctorcontact_address_line2',
        value: med.doctorContact.address.line2
      },
      {
        name: 'doctorcontact_address_city',
        value: med.doctorContact.address.city
      },
      {
        name: 'doctorcontact_address_postcode',
        value: med.doctorContact.address.postcode
      },
      {
        name: 'doctorcontact_address_country',
        value: med.doctorContact.address.country
      },
      {
        name: 'personalcontact_name',
        value: med.personalContact.name
      },
      {
        name: 'personalcontact_relationship',
        value: med.personalContact.relationship
      },
      ...(createArray("conditions", med.conditions)),
      ...(createArray("medications", med.medications)),
    ],
    item: {
      label: MEDICAL_ITEM_NAME
    }
  }
}

function arraySlotTemplate(size: number, labelPrefix: string, slotType: string) {
  return Array.from(Array(10), (_, i) => ({
      label: labelPrefix + i,
      slot_type_name: slotType
  }));
}

function loadArray(labelPrefix: string, slots: NestedSlotAttributes[]): string[] {
  let i: number = 0;
  let ret: string[] = [];

  while (true) {
    const nextSlot = slots.filter(it => it.name === (labelPrefix + i))[0]?.value;
    if (nextSlot) {
      i++;
      ret.push(nextSlot);
    } else {
      return ret;
    }
  }
}

function createArray(label: string, values: string[]): ItemSlot[] {
  return values.map((value, i) => ({
    name: label + i,
    value: value
  }))
}

export function loadMedicalInfo(slots: NestedSlotAttributes[]): state.MedicalInformation {
  let doctorName = slots.filter(it => it.name === "doctorcontact_name")[0]?.value;
  let doctorAddressLine1 = slots.filter(it => it.name === "doctorcontact_address_line1")[0]?.value;
  let doctorAddressLine2 = slots.filter(it => it.name === "doctorcontact_address_line2")[0]?.value;
  let doctorAddressCity = slots.filter(it => it.name === "doctorcontact_address_city")[0]?.value;
  let doctorAddressPostcode = slots.filter(it => it.name === "doctorcontact_address_postcode")[0]?.value;
  let doctorAddressCountry = slots.filter(it => it.name === "doctorcontact_address_country")[0]?.value;
  

  let contactName = slots.filter(it => it.name === "personalcontact_name")[0]?.value;
  let contactRelationship = slots.filter(it => it.name === "personalcontact_relationship")[0]?.value;
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
    conditions: loadArray("conditions", slots) as state.Condition[],
    medications: loadArray("medications", slots) as state.Medication[],
    }
  } 
  