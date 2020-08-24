import React from 'react'
import { CurrentFeeling } from '../state'
import * as state from '../state'

interface FeelingTodayProps {
    selected? : CurrentFeeling
    onChange: (cf: CurrentFeeling) => void,
    currentDate: Date,
    onSave: () => void
}

export const FeelingToday = (p: FeelingTodayProps) => 
    <div>
        <div>{p.currentDate.toDateString()}</div>

        <h2>How are you feeling today?</h2>

        <div className="card basic" style={{display: "block"}}>
            <div className="content" onClick={(e) => p.onChange(CurrentFeeling.Fine)}>
                😀 Fine {p.selected === state.CurrentFeeling.Fine ? 
                <i>tick-circled</i> : <span/>}</div>
        </div>

        <div className="card basic" style={{display: "block"}} onClick={(e) => p.onChange(CurrentFeeling.BitSick)}>
            <div className="content">😕 A bit sick {p.selected === state.CurrentFeeling.BitSick ? 
                <i>tick-circled</i> : <span/>}</div>
        </div>
        <div className="card basic" style={{display: "block"}} onClick={(e) => p.onChange(CurrentFeeling.VerySick)}>
            <div className="content">🤒 Very sick {p.selected === state.CurrentFeeling.VerySick ? 
                <i>tick-circled</i> : <span/>}</div>
        </div>
        <button className="primary large" onClick={(e) => p.onSave()}>Next</button>
    </div>