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


function HintUnderline(props: HintPos) {
  const style = { left: props.left, top: props.top, width: props.width }
  return <div className="highlight-underline" style={style}></div>
}


function HighlightTooltip(props: HintPos) {
  
  const self = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (self.current)
      new Tooltip(self.current) 
  }, [])
  
  // TODO: somehow stop this from swallowing up pointer events to the textarea
  const style = { left: props.left, top: props.top, width: props.width }
  return <div ref={self} style={style} className="highlight-tooltip"
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

  const underlines = highlightPoses.map((p, i) => 
    <HintUnderline left={p.left} top={p.top} width={p.width} hint={p.hint} key={i} />
  )
  const tooltips = highlightPoses.flatMap((p, i) => {
    if (p.hint)
      return [<HighlightTooltip left={p.left} top={p.top} width={p.width} hint={p.hint} key={i} />]
    else
      return []
  })
  
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setText(e.target.value)
    if (props.onChange)
      props.onChange(e)
  }
  
  return (
    <div className="highlight-textarea-wrapper">
      {tooltips}
      <textarea ref={textareaRef} className="form-control highlight-textarea" rows={6}
        onChange={onChange}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}>
      </textarea>
      {underlines}
      <div className="highlight-textarea-background"></div>
    </div>
  )
}
