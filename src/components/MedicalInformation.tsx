import React from 'react';
import * as state from '../state';
import { EditableStringList } from './EditableStringList';
import { AddressEditor } from './AddressEditor';

type MedicalInformationProps = {
    info: state.MedicalInformation,
    onDoctorContactEdit: (newValue: state.DoctorContact) => void,
    onPersonalContactEdit: (newValue: state.PersonalContact) => void,
    onMedicationsEdit: (newValue: state.Medication[]) => void,
    onConditionsEdit: (newValue: state.Condition[]) => void,
    editingDoctor: boolean,
    editingPersonal: boolean,
    editingMedications: boolean,
    editingConditions: boolean,
    toggleEditingDoctor: () => void,
    toggleEditingPersonal: () => void,
    toggleEditingMedications: () => void,
    toggleEditingConditions: () => void
}

interface ContactInformationProps {
    contact: state.Contact;
    editing: boolean;
    onEditContact: (newContact: state.Contact) => void;
    onToggleEdit: () => void;
}

const ContactInformation = (p: ContactInformationProps) => <div className="card">
    <div className="content">
        <span className="avatar"></span>
        <div>
            <h5>{p.editing ? 
                <input type="text" value={p.contact.name} onChange={(e) => p.onEditContact(state.contactNameL.set(p.contact, e.target.value))}/> 
                :  
                p.contact.name}</h5>
            <p>
                {p.contact.kind == 'doctor' ? 
                    (p.editing ? 
                        <AddressEditor address={p.contact.address} 
                        onEdit = {(addr) => p.onEditContact(state.contactAddressO.setOptional(p.contact, addr))}/> 
                        :  
                        state.singleLineAddress(p.contact.address)) : 
                p.editing ? 
                <input type="text" value={p.contact.relationship} onChange={(e) => { p.onEditContact(state.contactRelationshipO.setOptional(p.contact, e.target.value))}}/> 
                :  
                p.contact.relationship
                }
            </p>
        </div>
        <i onClick={e => p.onToggleEdit()} >{p.editing ? 'tick' : 'edit' } </i>
    </div>
    
</div>

export const MedicalInformation = (p: MedicalInformationProps) => { 
    return (<div id="header">
        <div className="active" >
            <h3>Medical</h3>
            <div className="advanced">
                <div className="card">
                    <div className="content red-shade">
                        <div className="icon">add-circled</div>
                        <p className="card-label">Medical Information</p>
                    </div>
                    <div className="content">
                        <div>
                            <h5>Conditions</h5>
                            <EditableStringList 
                                strings={p.info.conditions} 
                                editing={p.editingConditions}
                                onEdit={(ss) => p.onConditionsEdit(ss as state.Condition[])}
                                onToggleEdit={p.toggleEditingConditions} />
                        </div>
                    </div>
                    <div className="content">
                        <div>
                            <h5>Medications</h5>
                            <EditableStringList 
                                strings={p.info.medications} 
                                editing={p.editingMedications}
                                onEdit={(ss) => p.onMedicationsEdit(ss as state.Medication[])}
                                onToggleEdit={p.toggleEditingMedications} />
                        </div>
                    </div>
                </div>
            </div>
            <h3>Personal Contact</h3>
            <ContactInformation contact={p.info.personalContact} 
                onEditContact={p.onPersonalContactEdit}
                editing={p.editingPersonal} 
                onToggleEdit={p.toggleEditingPersonal}/>
            <h3>Doctor Contact</h3>
            <ContactInformation contact={p.info.doctorContact} 
                onEditContact={p.onDoctorContactEdit}
                editing={p.editingDoctor} 
                onToggleEdit={p.toggleEditingDoctor}/>
        </div>
    </div>);
};