import React from 'react'
interface ShareProps{
    userId: string
}

export const Share = (p: ShareProps) => <div>
        <h3>Share data with</h3>
        <input type="search" placeholder="User ID" value={p.userId}/>
    </div>