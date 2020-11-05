import React from 'react';

const CurrentQuote = ({ currentQuote }) => {
    const monthsTxt = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(currentQuote.appeared_at);
    const day = d.getDate()
    const month = monthsTxt[d.getMonth()];
    const year = d.getFullYear();

    return (
        <>
            {currentQuote.value !== undefined && (
                <>
                    <q style={{ color: 'red' }}>{currentQuote.value}</q>
                    <div>
                        <span>&#127919; </span>
                        <i>{currentQuote.tags.length === 0 ? 'No target detected' : currentQuote.tags}</i>
                    </div>
                    <div>
                        <span>&#128198; </span>
                        <small>
                            {`${month} - ${day} - ${year}`}
                        </small>
                    </div>
                    <div>
                        <span>&#128204; </span>
                        <a href={`${currentQuote._embedded.source[0].url}`} rel="noreferrer" target="_blank">Source</a>
                    </div>
                </>
            )
            }
        </>
    )
}

export default CurrentQuote;