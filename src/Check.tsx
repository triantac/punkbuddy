import React, { useState } from "react"
import { StaticContext, } from "react-router"
import { RouteComponentProps, } from "react-router-dom"
import { countNumWords } from "./Common"

export default (props: RouteComponentProps<{}, StaticContext, { text: string }>) => {
  
  const warningNumWords = 16
  const maxNumWords = 20
  const [text, setText] = useState(props.location.state.text)
  
  const textareaChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }
  
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
          PunkBuddy checks your text for you. Take a look at the suggestions. Is your punctuation correct? What can you fix?
          </p>
      </div>
      <div className="col-lg-8 col-12">
        <textarea className="form-control" rows={6} onChange={textareaChanged} defaultValue={text}>
        </textarea>
        <div className="progress mt-3">
          <div className={`progress-bar ${progressColor}`} role="progressbar"
            style={{ width: ((numWords / maxNumWords) * 100) + '%' }}
            aria-valuenow={numWords}
            aria-valuemin={0}
            aria-valuemax={maxNumWords}></div>
        </div>
        <div className="mt-1">
          <strong>{numWordsString}</strong>
          <em className="ml-2">{hintString}</em>
        </div>
      </div>
    </div>
  )
}
