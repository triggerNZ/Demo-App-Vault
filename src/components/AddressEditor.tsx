import React from 'react'
import * as state from '../state'
import { Lens } from '../lens';

export interface AddressEditorProps {
    address: state.Address, 
    onEdit: (newValue: state.Address) => void 
}
export const AddressEditor = (p: AddressEditorProps) => {
    function mod(l: Lens<state.Address, string>) {
        return (e: React.ChangeEvent<HTMLInputElement>) => p.onEdit(l.set(p.address, e.target.value));
    }
 return (<div>
    <input type="text" value={p.address.line1} placeholder="Line 1" onChange={mod(state.addressLine1L)}/>
    <input type="text" value={p.address.line2} placeholder="Line 2 (Optional)" onChange={mod(state.addressLine2L)} />
    <input type="text" value={p.address.city} placeholder="City" onChange={mod(state.addressCityL)} />
    <input type="text" value={p.address.postcode} placeholder="Postcode" onChange={mod(state.addressPostcodeL)}/>
    <input type="text" value={p.address.country} placeholder="Country" onChange={mod(state.addressCountryL)}/>
    </div>);
}