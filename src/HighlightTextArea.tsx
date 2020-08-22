import React, { useRef, useEffect, useState, ChangeEventHandler } from "react"
import getCaretCoordinates from "textarea-caret"
import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle"

export interface Highlight {
  pos: number
  length: number
  hint?: string
}

interface HintPos {
  left: number, top: number, width: number, hint: string | undefined
}

export interface HighlightTextareaProps {
  highlights: Highlight[]  
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  defaultValue?: string
  placeholder?: string
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

export default (props: HighlightTextareaProps) => {
  
  const [, setText] = useState("")
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textarea = textareaRef.current
  let highlightPoses: HintPos[]
  if (textarea) {
    highlightPoses = props.highlights.map(h => {
      const start = getCaretCoordinates(textarea, h.pos)
      const end = getCaretCoordinates(textarea, h.pos + h.length)
    
      return {
        left: start.left,
        top: start.top,
        width: end.left - start.left,
        hint: h.hint
      }
    })
  } else {
    highlightPoses = []
  }

  const hintHighlights = highlightPoses.map((p, i) => 
    <HintHighlight left={p.left} top={p.top} width={p.width} hint={p.hint} key={i} />
  )
  const hintTooltips = highlightPoses.flatMap((p, i) => {
    if (p.hint)
      return [<HintTooltip left={p.left} top={p.top} width={p.width} hint={p.hint} key={i} />]
    else
      return []
  })
  
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setText(e.target.value)
    if (props.onChange)
      props.onChange(e)
  }
  
  return (
    <div className="check-textarea-wrapper">
      {hintTooltips}
      <textarea ref={textareaRef} className="form-control check-textarea" rows={6}
        onChange={onChange}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}>
      </textarea>
      {hintHighlights}
      <div className="check-textarea-background"></div>
    </div>
  )
}
