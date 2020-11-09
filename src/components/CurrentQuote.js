import React from 'react';

const CurrentQuote = ({ currentQuoteState, isListMode, selectedTag, storedQuotes, ...rest}) => {
    const monthsTxt = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(currentQuoteState.appeared_at);
    const day = d.getDate()
    const month = monthsTxt[d.getMonth()];
    const year = d.getFullYear();
    const filteredQuotes = storedQuotes.filter(obj => selectedTag === obj.tags[0]);

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
                                    </li>
                                    )
                                })}
                            </ul>
                        </div>
                        : null}
                </>
            )
                : (
                <button
                onClick={rest.saveRandomQuote} 
                disabled={rest.isLoaded ? true : false}
                >
                    <h2>SAVE</h2>
                </button>
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