import React, { useEffect } from 'react';
import { useState, useRef } from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TransitionItem = ({ result, selectName }) => {
  const nodeRef = useRef();
  return <CSSTransition
    nodeRef={nodeRef}
    key={result}
    classNames="result"
    timeout={{ enter: 500, exit: 300 }}
  >
    <li key={result} ref={nodeRef} className="nameLi" onClick={selectName}>
      {result}
    </li>
  </CSSTransition>

}

const AutoComplete = ({ names }) => {

  const inputRef = useRef();

  const [showList, setShowList] = useState(false);

  const [inputVal, setInputVal] = useState('')


  useEffect(() => {
    if (showList) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      console.log("Removing Autocomplete listener on update!");
      document.removeEventListener('click', handleOutsideClick);
    }

  }, [showList])

  useEffect(() => {

    return () => {
      console.log("Cleaning up event listener from Autocomplete!");
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [])

  const handleInput = (e) => {
    setInputVal(e.target.value)
  }

  const selectName = ({ target: { innerText: name } }) => {
    setInputVal(name);
    setShowList(false)
  }

  // Set focus to input field if user clicks anywhere inside the Autocomplete
  // section (unless they have selected a name from the dropdown list)
  const handleAutocompleteSectionClick = ({ target }) => {
    if (!target.classList.contains("nameLi")) {
      inputRef.current.focus();
    }
  }

  const handleOutsideClick = () => {
    // Leave dropdown visible as long as input is focused
    if (document.activeElement === inputRef.current) return;
    else setShowList(false)
  }

  const matches = () => {
    const inputLength = inputVal.length;
    const matches = [];

    if (inputLength === 0) return names;

    names.forEach(name => {
      const nameSegment = name.slice(0, inputLength);
      if (nameSegment.toLowerCase() === inputVal.toLowerCase()) {
        matches.push(name);
      }
    });

    if (matches.length === 0) matches.push('No matches');

    return matches;
  }

  const results = matches().map((result) => {
    return (
      <TransitionItem result={result} selectName={selectName} />
    )
  });

  return (
    <section
      className="autocomplete-section"
      onClick={handleAutocompleteSectionClick}
    >
      <h1>Autocomplete</h1>
      <div className="auto">
        <input
          placeholder="Search..."
          ref={inputRef}
          onChange={handleInput}
          value={inputVal}
          onFocus={() => setShowList(true)}
        />
        {showList && (
          <ul className="auto-dropdown">
            <TransitionGroup>
              {results}
            </TransitionGroup>
          </ul>
        )}
      </div>
    </section>
  );

}

export default AutoComplete;
