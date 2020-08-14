import React, { useState, useRef, useEffect } from "react"
import { StaticContext, } from "react-router"
import { RouteComponentProps, } from "react-router-dom"
import { countNumWords } from "./Common"
import getCaretCoordinates from "textarea-caret"
import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle"


interface HintPos {
  left: number, top: number, width: number, hint: string
}

function HintHighlight(props: HintPos) {
  const style = { left: props.left, top: props.top, width: props.width }
  return <div className="check-textarea-hint-highlight" style={style}></div>
}

function HintTooltip(props: HintPos) {
  
  const self = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (self.current)
      new Tooltip(self.current) 
  }, [])
  
  // TODO: somehow stop this from swallowing up pointer events to the textarea
  const style = { left: props.left, top: props.top, width: props.width }
  return <div ref={self} style={style} className="check-textarea-hint-tooltip"
    data-toggle="tooltip" data-placement="top" title={props.hint}></div>
}

export default (props: RouteComponentProps<{}, StaticContext, { text: string }>) => {
  
  const warningNumWords = 16
  const maxNumWords = 20
  const [text, setText] = useState(props.location.state.text)
  

  const [hintPoses, setHintPoses] = useState<HintPos[]>([])
  
  const textareaChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    
    // TODO: state seems to lag behind
    const text = e.target.textContent
    if (text) {
      const regex = /\s+(but|as|so|though|although) /g
      let match: RegExpExecArray | null
      var newIndices: HintPos[] = []
      while ((match = regex.exec(text)) != null) {
        const ta = textarea.current
        const start = getCaretCoordinates(e.target, match.index + 1)
        const end = getCaretCoordinates(e.target, match.index + match[0].length - 1)
        newIndices.push({
          left: start.left,
          top: start.top,
          width: end.left - start.left,
          hint: "Maybe you should add a pause here."
        })
      }
      
      const beforeAfterRegex = /\s+(instead|however|firstly|secondly|finally|ultimately|alternatively|eventually|in my opinion|in conclusion) /g
      while ((match = beforeAfterRegex.exec(text)) != null) {
        const ta = textarea.current
        const start = getCaretCoordinates(e.target, match.index + 1)
        const end = getCaretCoordinates(e.target, match.index + match[0].length - 1)
        newIndices.push({
          left: start.left,
          top: start.top,
          width: end.left - start.left,
          hint: "Maybe you should add a pause before and after here."
        })
      }
      
      setHintPoses(newIndices)
    }
  }
  
  const textarea = useRef<HTMLTextAreaElement>(null)
  

  const hintHighlights = hintPoses.map((p, i) => 
    <HintHighlight left={p.left} top={p.top} width={p.width} hint={p.hint} key={i} />
  )
  const hintTooltips = hintPoses.map((p, i) => 
    <HintTooltip left={p.left} top={p.top} width={p.width} hint={p.hint} key={i} />
  )
  
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
      <div className="col-lg-8 col-12 mt-3 mb-3">
        <div className="check-textarea-wrapper">
          {hintTooltips}
          <textarea ref={textarea} className="form-control check-textarea" rows={6} onChange={textareaChanged} defaultValue={text}>
          </textarea>
          {hintHighlights}
        </div>
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
