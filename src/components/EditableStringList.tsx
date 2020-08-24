import React from 'react';
import * as lens from '../lens';

interface EditableStringListProps {
    strings: string[];
    editing: boolean,
    onEdit: (newStrings: string[]) => void,
    onToggleEdit: () => void
}

export const EditableStringList = (p: EditableStringListProps) => <div className="content">
    <div>
        {p.strings.map((s, i) => <div key={i}>{ 
            p.editing ? 
            <input type="text" 
            value={s}
            onChange={e => p.onEdit(lens.atL<string>(i).set(p.strings, e.target.value))  }/> 
            : 
            s}</div>)}
            {p.editing? <i onClick={(e) => p.onEdit([...p.strings, ""])}>add</i> : <span/>}
    </div>
    <i onClick={e => p.onToggleEdit()} >{p.editing ? 'tick' : 'edit' } </i>
</div>
