import React from "react"

interface IWriteState {
  text: string
  loading: boolean
  listensRemaining: number
  curCharIndex?: number
  curCharLength?: number
}

interface IReaderTextAreaProps {
  text: string
  curCharIndex: number
  height: number
}

function ReaderTextArea(props: IReaderTextAreaProps) {
  const textBefore = props.text.substr(0, props.curCharIndex)
  const lengthOfWord = /[^A-Za-z\d']/
    .exec(props.text.substr(props.curCharIndex))?.index ?? props.text.length
  const highlightText = props.text.substr(props.curCharIndex, lengthOfWord)
  const textAfter = props.text.substr(props.curCharIndex + lengthOfWord)

  const height = props.height + 2

  return <div className="reader-textarea" style={{ height: height, marginTop: -height }}>
    {textBefore}<span className="highlighted-text">{highlightText}</span>{textAfter}
  </div>
}

export default class Write extends React.Component<Readonly<{}>, IWriteState> {

  textarea: React.RefObject<HTMLTextAreaElement>

  constructor(props: Readonly<Readonly<{}>>) {
    super(props)
    this.state = {
      text: 'Hello',
      loading: false,
      listensRemaining: 3,
      curCharIndex: undefined,
      curCharLength: undefined
    }
    this.textarea = React.createRef();
  }

  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise(resolve => {
      let voices = speechSynthesis.getVoices()
      if (voices.length) {
        resolve(voices)
        return
      }
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices()
        resolve(voices)
      }
    })
  }

  async speak() {
    if (this.state.listensRemaining <= 0 || this.state.loading)
      return;

    this.setState({ loading: true, listensRemaining: this.state.listensRemaining - 1 })
    try {
      // Try to use browser speech synth api, otherwise fallback to serverless func
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(this.state.text)
        utterance.onboundary = (e) => {
          this.setState({
            curCharIndex: e.charIndex
          })
        }
        utterance.onstart = (e) => this.setState({ curCharIndex: 0 })
        utterance.onend = (e) => this.setState({ curCharIndex: undefined })
        utterance.rate = 0.8

        // Choose Daniel if we can, to prevent 'Arthur Siri' from being selected
        // which doesn't work on Chromium
        const voice = (await this.getVoices()).find(x => x.name === 'Daniel')
        if (voice)
          utterance.voice = voice
        else
          console.log('crap')

        speechSynthesis.speak(utterance)
        console.log('asdf')
      } else {
        // IMPORTANT! Need to create the Audio ASAP otherwise the anti-autoplay
        // feature in browsers will block the call to play at the bottom, so
        // create it before the fetch
        const audio = new Audio()
        const req = await fetch(`/api/speech?text=${this.state.text}`)
        const base64 = await req.text()
        audio.src = `data:audio/mpeg3;base64,${base64}`
        audio.play()
      }
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const textareaChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.setState({
        text: e.target.value
        // listensRemaining:
        //   this.state.text === e.target.value ? this.state.listensRemaining : 3
      })
    }

    const speakButtonText =
      this.state.listensRemaining <= 0 ?
        'Out of listens' : `Speak (${this.state.listensRemaining})`
    const speakDisabled = this.state.loading || this.state.listensRemaining <= 0

    return (
      <div>
        <h1>Listen to your writing</h1>
        <p>
        Modi temporibus esse dolorem quasi dolorem doloremque ipsum similique. Non laudantium temporibus rerum. Assumenda blanditiis aut quo sed ratione non culpa error. Quis dolores sunt harum. Et rerum minima voluptatem eveniet quia cumque commodi.
        </p>
        <div className="mb-3">
          {
            // this.state.curCharIndex === undefined &&
            <textarea className="form-control"
              onChange={textareaChanged}
              style={{visibility: this.state.curCharIndex === undefined ? "visible" : "hidden"}}
              ref={this.textarea}
              id="write-textarea"
              placeholder="Modi temporibus esse dolorem quasi dolorem doloremque ipsum similique. Non laudantium temporibus rerum. Assumenda blanditiis aut quo sed ratione non culpa error. Quis dolores sunt harum. Et rerum minima voluptatem eveniet quia cumque commodi."
              rows={6}>
            </textarea>
          }

          {
            this.state.curCharIndex !== undefined &&
            <ReaderTextArea
              text={this.state.text}
              curCharIndex={this.state.curCharIndex ?? 0}
              height={this.textarea.current?.clientHeight ?? 0}/>
          }
        </div>
        <button className={`btn btn-primary ${speakDisabled ? "disabled" : ""}`}
          onClick={this.speak.bind(this)}>{speakButtonText}</button>
      </div>
    )
  }

}
