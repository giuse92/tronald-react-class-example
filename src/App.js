import React, { useState } from 'react';
import './App.css';
import logo from './trump.gif';
import TagList from './components/TagList';
import CurrentQuote from './components/CurrentQuote';
import ErrorMessage from './components/ErrorMessage'

// TODO:
// FACILE
// 1) dividere i componenti in file diversi ***FATTO***
// 2) this.state.currentQuote ***FATTO***
//    creare un componente che visualizzi, oltre che la citazione stessa, anche:
//    - lista di tag associati alla citazione (array "tags")
//    - data della citazione (appeared_at)
//    - link alla fonte della citazione (investigare nella chiave "_embedded",
//      prendete sempre il primo elemento dell'array "source")
// 3) gestione carina ed appropriata degli errori (this.state.error) ***FATTO***
// 4) modalità lista, visualizzare le citazioni associate al tag selezionato ***FATTO***
//    (utilizzando il componente creato nel punto 2)
//    (fatelo comportare in maniera diversa a seconda della modalità random/list)
// 5) tornando alla modalità random, deselezionare il tag selezionato ***FATTO***
// medio/difficile
// 6) arricchire il componente creato nel punto 2 con un meccanismo di salvataggio (solo in modalità random) - CONTROLLARE CHE LA CITAZIONE NON SIA STATA GIA' SALVATA (quote_id) ***FATTO***
// 7) arricchire il componente creato nel punto 2 con un meccanismo di cancellazione (solo in modalità lista)
//    (utilizzate il campo "quote_id" all'interno della citazione)

const RANDOMURL = 'https://api.tronalddump.io/random/quote'
// const SEARCHURL = 'https://api.tronalddump.io/search/quote'
// const ALLTAGSURL = 'https://api.tronalddump.io/tag'
const bidenSmilingSrc = 'https://d3g9pb5nvr3u7.cloudfront.net/authors/59bb2de59744155625a7c141/-435182605/256.jpg'

const App = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(((JSON.parse(localStorage.getItem('trumpCurrentQuote'))) !== null
    ? (JSON.parse(localStorage.getItem('trumpCurrentQuote')))
    : {}));
  //const [quotesToShow, setQuotesToShow] = useState([]);
  const [storedQuotes, setStoredQuotes] = useState(((JSON.parse(localStorage.getItem('trumpQuotes'))) !== null
    ? (JSON.parse(localStorage.getItem('trumpQuotes')))
    : []));
  const [storedTags, setStoredTags] = useState(((JSON.parse(localStorage.getItem('trumpQuotesTags'))) !== null
    ? (JSON.parse(localStorage.getItem('trumpQuotesTags'))) 
    : []));
  const [selectedTag, setSelectedTag] = useState('');
  const [isListMode, setIsListMode] = useState(false);
  const [btnSaveDisabled, setBtnSaveDisabled] = useState(JSON.parse(localStorage.getItem('trumpQuotesTags')) === null
    ? true 
    : false);

      /*loading: false,
      error: false,
      currentQuote: ((JSON.parse(localStorage.getItem('trumpCurrentQuote'))) !== null
        ? (JSON.parse(localStorage.getItem('trumpCurrentQuote')))
        : {}),
      quotesToShow: [],
      // getting storage string with key 'trumpQuotes' and parsing it (if exists)
      storedQuotes: ((JSON.parse(localStorage.getItem('trumpQuotes'))) !== null 
      ? (JSON.parse(localStorage.getItem('trumpQuotes'))) 
      : []),
      storedTags: ((JSON.parse(localStorage.getItem('trumpQuotesTags'))) !== null 
      ? (JSON.parse(localStorage.getItem('trumpQuotesTags'))) : []),
      selectedTag: '',
      isListMode: false,
      btnSaveDisabled: JSON.parse(localStorage.getItem('trumpQuotesTags')) === null 
      ? true : false*/

  // dividere in fetchRandomTrump() e saveRandomTrump()
  const fetchRandomTrump = async () => {
    let quote = {}
    let error = false

    try {
      setLoading(true);
      //this.setState({ loading: true })
      let response = await fetch(RANDOMURL)
      let data = await response.json()
      //console.log('NEL TRY DATA: ', data)
      // promise is still resolved even if no quotes got fetched (example: wrong url)
      // need to handle this situation manually
      // throw new Error blocks the execution, and jumps directly into 'CATCH'
      if (data.error) throw new Error(data.error)

      quote = { ...data }

    } catch (err) {
      console.log('SONO NEL CATCH: ', err)
      error = true;
      //error ? this.setState({ ...this.state, fetchErr: err }) : this.setState(...this.state);
    } finally {
      // using setState with prevState
      // see https://css-tricks.com/understanding-react-setstate/
      localStorage.setItem('trumpCurrentQuote', JSON.stringify(quote));
      setCurrentQuote(error ? {} : quote);
      setLoading(false);
      setError(error);
      setBtnSaveDisabled(false);
            
      /*this.setState((prevState) => {
        localStorage.setItem('trumpCurrentQuote', JSON.stringify(quote))
        return {
          ...this.state, // see immutables
          currentQuote: error ? {} : quote,
          loading: false,
          error,
          btnSaveDisabled: false
        }
      })*/
    }
  }

  const saveRandomQuote = (event) => {
    const storedQuotesX = storedQuotes;
    //const storedQuotes = this.state.storedQuotes
    let storedTagsX = storedTags;
    //let storedTags = this.state.storedTags
    // see inside quote.tags.forEach
    // let storedTags = [...this.state.storedTags]
    let isNewQuote = true;

    // checking for each retrieved tag, if exists
    if (currentQuote.tags.length > 0) {
      currentQuote.tags.forEach(currentTag => {
        const indexTag = storedTagsX.findIndex(storedTag => storedTag === currentTag)
        if (indexTag === -1) {
          // mutable operation will lead to bugs here
          // storedTags.push(currentTag)
          storedTagsX = [...storedTagsX, currentTag]
        }
      })
    }

    /*
    if (this.state.currentQuote.tags.length > 0) {
      this.state.currentQuote.tags.forEach(currentTag => {
        const indexTag = storedTags.findIndex(storedTag => storedTag === currentTag)
        if (indexTag === -1) {
          // mutable operation will lead to bugs here
          // storedTags.push(currentTag)
          storedTags = [...storedTags, currentTag]
        }
      })
    }
    */

    // checking stored quotes
    // avoid condition if array is empty
    if (storedQuotesX.length > 0) {
      // check if quote already exists
      const indexQuote = storedQuotesX.findIndex(storedQuote => currentQuote.quote_id === storedQuote.quote_id)
      if (indexQuote > -1) { // this means that quote already exists!
        isNewQuote = false
      }
    }

    /* 
    if (storedQuotes.length > 0) {
      // check if quote already exists
      const indexQuote = storedQuotes.findIndex(storedQuote => this.state.currentQuote.quote_id === storedQuote.quote_id)
      if (indexQuote > -1) { // this means that quote already exists!
        isNewQuote = false
      }
    }
    */


    const quotesToSave = (isNewQuote && error !== true) ? [...storedQuotesX, currentQuote]: storedQuotes;
    localStorage.setItem('trumpQuotes', JSON.stringify(quotesToSave));
    localStorage.setItem('trumpQuotesTags', JSON.stringify(storedTags));
    setStoredQuotes([...quotesToSave]);
    setStoredTags([...storedTagsX]);
    setBtnSaveDisabled(true);
    /*this.setState((prevState) => {
      const quotesToSave = (isNewQuote && this.state.error !== true) ? [...prevState.storedQuotes, this.state.currentQuote] : prevState.storedQuotes
      // storing into localStorage
      localStorage.setItem('trumpQuotes', JSON.stringify(quotesToSave))
      localStorage.setItem('trumpQuotesTags', JSON.stringify(storedTags))
      return {
        ...this.state, // see immutables
        storedQuotes: [...quotesToSave],
        storedTags: [...storedTags],
        btnSaveDisabled: true
      }
    })*/
  }

  const removeQuoteFromList = (quoteIdList) => {
    const indexQ = storedQuotes.findIndex(obj => obj.quote_id === quoteIdList);
    const newStoredQ = [...storedQuotes.slice(0, indexQ), ...storedQuotes.slice(indexQ + 1)];
    localStorage.setItem('trumpQuotes', JSON.stringify(newStoredQ));

    const filteredBySelectedTag = newStoredQ.filter(quote => quote.tags[0] === selectedTag);
    const indexSelectedTag = storedTags.findIndex(tagStr => tagStr === selectedTag);
    const newStoredTags = [...storedTags.slice(0, indexSelectedTag), ...storedTags.slice(indexSelectedTag + 1)];
    localStorage.setItem('trumpQuotesTags', JSON.stringify(newStoredTags));

    setStoredQuotes(newStoredQ);
    setStoredTags(filteredBySelectedTag.length === 0 ? newStoredTags : storedTags)
    /*this.setState((prevState) => {
      const indexQ = this.state.storedQuotes.findIndex(obj => obj.quote_id === quoteIdList);
      const newStoredQ = [...this.state.storedQuotes.slice(0, indexQ), ...this.state.storedQuotes.slice(indexQ + 1)];
      localStorage.setItem('trumpQuotes', JSON.stringify(newStoredQ));

      const filteredBySelectedTag = newStoredQ.filter(quote => quote.tags[0] === this.state.selectedTag);
      const indexSelectedTag = this.state.storedTags.findIndex(tagStr => tagStr === this.state.selectedTag);
      const newStoredTags = [...this.state.storedTags.slice(0, indexSelectedTag), ...this.state.storedTags.slice(indexSelectedTag + 1)];
      localStorage.setItem('trumpQuotesTags', JSON.stringify(newStoredTags));

      return {
        ...this.state,
        storedQuotes: newStoredQ,
        storedTags: filteredBySelectedTag.length === 0 ? newStoredTags : prevState.storedTags 
      }
    })*/
  }

  const onTagClick = (event) => setSelectedTag(event.target.name);
  //const onTagClick = (event) => this.setState({ selectedTag: event.target.name })

  const onModeClick = (mode) => (event) => {
    setIsListMode(event.currentTarget.id === 'listbutton' ? true : false);
    setSelectedTag(event.currentTarget.id === 'randombutton' && '')
  }  
  /*const onModeClick = (mode) => (event) => {
    // console.log('MODE? ', mode)
    this.setState({ 
      isListMode: event.currentTarget.id === 'listbutton' ? true : false,
      selectedTag: event.currentTarget.id === 'randombutton' && '' 
    })
  }*/ 

  /*componentDidUpdate(prevProps, prevState) {
    // console.log('PROBLEM!!! ', prevState.storedTags.length, this.state.storedTags.length)
    if (prevState.storedTags.length !== this.state.storedTags.length) console.log('DIFFERENZA STOREDTAG!')
  }*/

    return (
      <div className="App">
        <header className="App-header">
          <img src={error ? bidenSmilingSrc : logo} className={`App-logo${loading ? " App-logo-spinning" : ""}`} alt="logo" />
          <p>
            <button className="button" id="randombutton" type="button" onClick={onModeClick('random')} disabled={!isListMode}>
              <h3> RANDOM MODE </h3> 
            </button>
            <button className="button" id="listbutton" type="button" onClick={onModeClick('list')} disabled={isListMode}>
              <h3> LIST MODE </h3>
            </button>
          </p>
          {isListMode ? (<TagList
            storedTags={storedTags}
            onTagClick={onTagClick}
            selectedTag={selectedTag}
          />) : (<>
            <p>
              {error ? <ErrorMessage /> : null}
                <button onClick={fetchRandomTrump} disabled={loading || error}>
                <h2>
                  {loading ? 'loading...' : 'RANDOM TRUMP QUOTE'}
                </h2>
              </button>
            </p>
          </>)}
          <CurrentQuote 
          currentQuoteState={currentQuote} 
          isListMode={isListMode}
          selectedTag={selectedTag}
          storedQuotes={storedQuotes}
          isLoaded={loading}
          saveRandomQuote={saveRandomQuote}
          btnSaveDisabled={btnSaveDisabled}
          errState={error}
          removeQuoteF={removeQuoteFromList}
          />
          <p>Citazioni salvate: {storedQuotes.length}</p>
          <p>Tag salvati: {storedTags.length}</p>
        </header>
      </div>
    );
}

export default App;


// mutable / immutable useful links:
// https://stackoverflow.com/questions/48057906/prevstate-in-componentdidupdate-is-the-currentstate#48058492
// https://ultimatecourses.com/blog/all-about-immutable-arrays-and-objects-in-javascript#immutable-object-operations

// OTHER USEFUL LINKS:
// https://www.taniarascia.com/understanding-destructuring-rest-spread/
// https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript