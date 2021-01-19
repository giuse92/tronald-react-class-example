import React from 'react';
import MyContext from "./MyContext";

const CurrentQuote = ({ currentQuoteState, isListMode, selectedTag, storedQuotes, ...rest}) => {
    const monthsTxt = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(currentQuoteState.appeared_at);
    const day = d.getDate()
    const month = monthsTxt[d.getMonth()];
    const year = d.getFullYear();
    const filteredQuotes = storedQuotes.filter(obj => selectedTag === obj.tags[0]);
    const currentQuoteIndex = storedQuotes.findIndex(objQuote => objQuote.quote_id === currentQuoteState.quote_id);

    return (
        <>  
            {isListMode ? (
                <>
                    {selectedTag !== '' ?
                        <div style={{width: '50%', fontSize: '22px'}}>
                            <ul style={{listStyle: 'none'}}>
                                {filteredQuotes.map((q, i) => {
                                    return (
                                    <li key={`filtered-quotes-${i}`} style={{borderBottom: '2px solid white'}}>
                                        {q.value}
                                        <button onClick={(e) => {e.stopPropagation(); rest.removeQuoteF(q.quote_id)}}><h2>REMOVE</h2></button>
                                    </li>
                                    )
                                })}
                            </ul>
                        </div>
                        : null
                    }
                </>
                )
                : (
                <>
                <button
                onClick={rest.saveRandomQuote} 
                disabled={rest.isLoaded || rest.errState || rest.btnSaveDisabled || currentQuoteIndex > -1}
                >
                    <h2>{currentQuoteIndex > -1 ? 'QUOTE SAVED' : 'SAVE'}</h2>
                </button>
                </>
                )}
            {currentQuoteState.value !== undefined && (
                <>
                    <h5 style={{ marginBottom: 0 }}>Current quote:</h5>
                    <q style={{ color: 'red' }}>{currentQuoteState.value}</q>
                    <div>
                        <span>&#127919; </span>
                        <i>{currentQuoteState.tags.length === 0 ? 'No target detected' /* Empty currentQuoteState.tags */ : currentQuoteState.tags}</i>
                    </div>
                    <div>
                        <span>&#128198; </span>
                        <small>
                            {`${month} - ${day} - ${year}`}
                        </small>
                    </div>
                    <div>
                        <span>&#128204; </span>
                        <a href={`${currentQuoteState._embedded.source[0].url}`} rel="noreferrer" target="_blank">Source</a>
                    </div>
                </>
            )
            }
        </>
    )
}

export default CurrentQuote;