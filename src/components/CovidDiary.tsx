import React from 'react'

import * as state from '../state'

interface CovidDiaryProps {
    diary: state.CovidDiary
}
export const CovidDiary = (p: CovidDiaryProps) => <div>
    <h3>Covid Diary</h3>
    {p.diary.map( (diaryItem, i) =>
    <div className="card basic" key={i}>
        <div className="content">
            <h2>{feelingEmoji(diaryItem.feeling)}</h2>
            <p className="card-label">{dayOfWeek(diaryItem.date)}</p>
            <p>{dateFormat(diaryItem.date)}</p>
        </div>
    </div>)}
</div>

const feelingEmoji = (feeling: state.CurrentFeeling): string => {
    switch (feeling) {
        case state.CurrentFeeling.Fine:
            return "😀";
        case state.CurrentFeeling.BitSick:
            return "😕";
        case state.CurrentFeeling.VerySick:
            return "🤒";
    }
}

function dayOfWeek(date: Date): string {
    switch (date.getDay()) {
        case 0: return "Sunday"
        case 1: return "Monday"
        case 2: return "Tuesday"
        case 3: return "Wednesday"
        case 4: return "Thursday"
        case 5: return "Friday"
        case 6: return "Saturday"

    }
}

function dateFormat(date: Date): string {
    const dateTimeFormat = new Intl.DateTimeFormat('en-AU', {year: 'numeric', month: 'long', day: '2-digit'});
    return dateTimeFormat.format(date);
}
