import React from 'react'
import * as state from '../state';
import { MedicalInformation } from './MedicalInformation';

interface SharingProps {
    connections: state.ConnectionWithName[],
    sharedWithMe: Record<state.ConnectionId, state.MedicalInformation>;
    sharedWithThem: state.ConnectionId[];
    myUserId: string;
    onShare: (c: state.ConnectionWithName) => void

}

export const Sharing = (p: SharingProps) =>
    <div>
        {p.connections.map(c => {
            return <div key={c.connection.id}>
            <li>
                <p><em>{c.name}</em></p>
                <p style={{zoom: '50%'}}>{p.sharedWithMe[c.connection.id] 
                    ? 
                    <MedicalInformation
                        info={p.sharedWithMe[c.connection.id]}
                        editable={false}
                        onConditionsEdit={() => {}}
                        onDoctorContactEdit={() => {}}
                        onPersonalContactEdit={() => {}}
                        onMedicationsEdit={() => {}}
                        onNameEdit={() => {}}
                        editingDoctor={false}
                        editingConditions={false}
                        editingMedications={false}
                        editingPersonal={false}
                        editingName={false}
                        toggleEditingConditions={() => {}}
                        toggleEditingMedications={() => {}}
                        toggleEditingDoctor={() => {}}
                        toggleEditingName={() => {}}
                        toggleEditingPersonal={() => {}}
                    />: ''} </p>
                <p>{p.sharedWithThem.indexOf(c.connection.id) >= 0 
                    ? 'Already shared'
                    : 
                    <i onClick={() => p.onShare(c)}>share</i>} </p>
            </li>
        </div>
    })}
    </div>
