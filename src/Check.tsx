import React, { useState, useEffect } from "react"
import { StaticContext, } from "react-router"
import { RouteComponentProps, } from "react-router-dom"
import { countNumWords } from "./Common"
import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle"
import HighlightTextArea, { Highlight } from "./HighlightTextArea"

export default (props: RouteComponentProps<{}, StaticContext, { text: string }>) => {
  
  const warningNumWords = 15
  const maxNumWords = 18
  const [text, setText] = useState(props.location.state.text)
  

  const [highlights, setHighlights] = useState<Highlight[]>([])
  
  const textareaChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    
    // TODO: state seems to lag behind
    const text = e.target.value
    const regex = /\b(but|as|so|though|although)\s/gi
    let match: RegExpExecArray | null
    var newIndices: Highlight[] = []

    const addHint = (match: RegExpExecArray, hint: string) => {
      newIndices.push({
        pos: match.index,
        length: match[0].length - 1,
        hint: hint
      })
    }

    while ((match = regex.exec(text)) != null) {
      addHint(match, "Maybe you should add a pause here.")
    }

    const beforeAfterRegex = /\b(instead|however|firstly|secondly|finally|ultimately|alternatively|eventually|in my opinion|in conclusion)\s/gi
    while ((match = beforeAfterRegex.exec(text)) != null) {
      addHint(match, "Maybe you should add a pause before and after here.")
    }

    const afterRegex = /\b(dear diary|dear sir|dear madam)\s/gi
    while ((match = afterRegex.exec(text)) != null) {
      addHint(match, "Maybe you should add a pause after here.")
    }

    setHighlights(newIndices)
  }
  
  useEffect(() => {
    // Initialize the tooltips
    const helpEls = document.getElementsByClassName('help-tooltip')
    for (let i = 0; i < helpEls.length; i++)
      new Tooltip(helpEls[i])
  }, [])
  
  const sentenceStart = Math.max(0, text.lastIndexOf('.'))
  const curSentence = text.substr(sentenceStart + 1)
  const numWords = countNumWords(curSentence)
  
  const numWordsString = `${numWords} word${numWords === 1 ? '' : 's'}`
  let hintString = ''
  let progressColor = 'bg-success'
  if (numWords >= warningNumWords) {
    progressColor = 'bg-warning'
    hintString = 'Maybe you should finish your sentence soon.'
  }
  if (numWords >= maxNumWords) {
    progressColor = 'bg-danger'
    hintString = 'Your sentence is getting too long!'
  }
  
  return (
    <div className="row">
      <div className="col-lg-4 col-12">
        <h1>Check your writing</h1>
          <p>
            Welcome to PunkBuddy! Here, you can write your text, listen to it, and correct it.
          </p>
          <button className="btn btn-outline-info help-tooltip"
            data-toggle="tooltip" data-placement="top"
            title="PunkBuddy checks your text for you. Take a look at the suggestions. Is your punctuation correct? What can you fix?">
            Instructions
          </button>
      </div>
      
      <div className="col-lg-8 col-12 mt-3 mb-3">
        <HighlightTextArea highlights={highlights} onChange={textareaChanged} defaultValue={text}/>
        <div className="progress mt-3">
          <div className={`progress-bar ${progressColor}`} role="progressbar"
            style={{ width: ((numWords / maxNumWords) * 100) + '%' }}
            aria-valuenow={numWords}
            aria-valuemin={0}
            aria-valuemax={maxNumWords}></div>
        </div>
        <div className="mt-1">
          Sentence length: <strong>{numWordsString}</strong>
          <em className="ml-2">{hintString}</em>
        </div>
      </div>
    </div>
  )
}
