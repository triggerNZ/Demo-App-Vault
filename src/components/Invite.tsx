import React from 'react'

import {Invitation} from '@meeco/vault-api-sdk'
import {AcceptInvite} from '../state'

interface InviteProps{
    newInviteName: string,
    onChangeNewInviteName: (newValue: string) => void;
    currentInvitation?: Invitation;

    acceptInvite: AcceptInvite,
    onChangeAcceptInvite: (newValue: AcceptInvite) => void
    onAcceptInvite: () => void;
    onInvite: () => void;
}

export const Invite = (p: InviteProps) => <div>
        <h3>Send invitation</h3>
        <input type="text" placeholder="Invitation name:" value={p.newInviteName} onChange={(e) => p.onChangeNewInviteName(e.target.value)}/>
        <button className="primary large" onClick={() => p.onInvite()}>Invite</button>

        {
            p.currentInvitation ?
            <div>
                <p>Send the following invitation to the recipient.</p> 
                <p>They will enter it in the section below</p>
                <p>Name: {p.newInviteName}</p>
                <p>Token: {p.currentInvitation.token}</p>
            </div>
            :
            <div/>
        }
        <hr/>
        <h3>Accept invitation</h3>
        <input type="text" placeholder="Invitation name:" value={p.acceptInvite.name} 
            onChange={e => p.onChangeAcceptInvite({...p.acceptInvite, name: e.target.value})}/>
        <input type="text" placeholder="Invitation token:" value={p.acceptInvite.token} 
            onChange={e => p.onChangeAcceptInvite({...p.acceptInvite, token: e.target.value})} />
        <button className="primary large" onClick={() => p.onAcceptInvite()}>Accept</button>
    </div>