import React from "react"
import { Link } from "react-router-dom"
import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle"
import { countNumWords } from "./Common"
import HighlightTextArea, { Highlight } from "./HighlightTextArea"

enum PlaybackState {
  Loading, Playing, Paused, Stopped
}

interface IWriteState {
  text: string
  playback: PlaybackState
  listensRemaining: number
  canCheck: boolean
  numWordsWithoutListen: number
  prevNumWordsWithoutListen: number
  highlights: Highlight[]
}

export default class Write extends React.Component<Readonly<{}>, IWriteState> {

  textarea: React.RefObject<HTMLTextAreaElement>

  constructor(props: Readonly<Readonly<{}>>) {
    super(props)
    this.state = {
      text: 'Hello',
      playback: PlaybackState.Stopped,
      listensRemaining: 5,
      canCheck: false,
      numWordsWithoutListen: 0,
      prevNumWordsWithoutListen: 0,
      highlights: []
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
  
  componentDidMount() {
    // Initialize the tooltips
    const helpEls = document.getElementsByClassName('help-tooltip')
    for (let i = 0; i < helpEls.length; i++)
      new Tooltip(helpEls[i])
  }

  async speak() {
    if (this.state.listensRemaining <= 0 || this.state.playback !== PlaybackState.Stopped)
      return;

    if (this.state.listensRemaining <= 3)
      this.setState({ canCheck: true })
    this.setState({
      playback: PlaybackState.Loading,
      listensRemaining: this.state.listensRemaining - 1,
      numWordsWithoutListen: 0,
      prevNumWordsWithoutListen: 0
    })

    try {
      // Try to use browser speech synth api, otherwise fallback to serverless func
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(this.state.text)
        utterance.onboundary = (e) => {
          const lengthOfWord = /[^A-Za-z\d']/
            .exec(this.state.text.substr(e.charIndex))?.index ?? this.state.text.length 
          this.setState({
            highlights: [{
              pos: e.charIndex,
              length: lengthOfWord
            }]
          })
        }
        utterance.onstart = (e) => this.setState({ highlights: [], playback: PlaybackState.Playing })
        utterance.onend = (e) => this.setState({ highlights: [], playback: PlaybackState.Stopped })
        utterance.onerror = console.error
        utterance.rate = 0.8

        // Choose Daniel if we can, to prevent 'Arthur Siri' from being selected
        // which doesn't work on Chromium
        const voice = (await this.getVoices()).find(x => x.name === 'Daniel')
        if (voice)
          utterance.voice = voice

        speechSynthesis.speak(utterance)
      } else {
        // IMPORTANT! Need to create the Audio ASAP otherwise the anti-autoplay
        // feature in browsers will block the call to play at the bottom, so
        // create it before the fetch
        const audio = new Audio()
        const req = await fetch(`/api/speech?text=${this.state.text}`)
        const base64 = await req.text()
        audio.src = `data:audio/mpeg3;base64,${base64}`
        audio.play()
        audio.onplay = (e) => this.setState({ playback: PlaybackState.Playing })
        audio.onended = (e) => this.setState({ playback: PlaybackState.Stopped })
      }
    } catch {
      this.setState({ playback: PlaybackState.Stopped })
    }
  }
  
  play() {
    //TODO: Handle the Audio() scenario?
    if ('speechSynthesis' in window) {
      speechSynthesis.resume()
      this.setState({ playback: PlaybackState.Playing })
    }
  }
  
  pause() {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause()
      this.setState({ playback: PlaybackState.Paused })
    }
  }

  render() {

    const textareaChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const numWords = countNumWords(e.target.value)
      let numNewWords = numWords - this.state.prevNumWordsWithoutListen
      if (numNewWords < 0)
        numNewWords = 0
      this.setState({
        text: e.target.value,
        numWordsWithoutListen: this.state.numWordsWithoutListen + numNewWords,
        prevNumWordsWithoutListen: numWords
        // listensRemaining:
        //   this.state.text === e.target.value ? this.state.listensRemaining : 3
      })
    }
    
    const showListenReminder = this.state.numWordsWithoutListen >= 50;

    const speakButtonText =
      this.state.listensRemaining <= 0 ?
        'Out of listens' : `Listen to your text! (${this.state.listensRemaining} attempts remaining)`
    const speakDisabled = this.state.playback !== PlaybackState.Stopped || this.state.listensRemaining <= 0

    return (
      <div className="row">
        <div className="col-12 col-lg-4">
          <h1>Listen to your writing</h1>
          <p>
            Welcome to PunkBuddy! Here, you can write your text, listen to it, and correct it.
          </p>
          <button className="btn btn-outline-info help-tooltip"
            data-toggle="tooltip" data-placement="top"
            title="PunkBuddy reads your text for you. Listen to your text a few times and correct it. Then, PunkBuddy will check it for you. Do you hear any pauses? Do you need more pauses?">
            Instructions
            </button>
        </div>
        <div className="col-12 col-lg-8">
          <div className="mb-3 mt-3">
            <HighlightTextArea onChange={textareaChanged} highlights={this.state.highlights} placeholder="Write your text here"/>
          </div>
          {
            showListenReminder &&
            <div className="alert alert-info" role="alert">
              You should now listen to what you have written so far
            </div>
          }
          <div className="btn-group mr-auto" role="group">
            <button className={`btn btn-secondary ${speakDisabled ? "disabled" : ""}`}
              onClick={this.speak.bind(this)}>{speakButtonText}</button>
            {
              this.state.playback === PlaybackState.Playing &&
              <button className="btn btn-secondary" onClick={this.pause.bind(this)}>Pause</button>
            }
            {
              this.state.playback === PlaybackState.Paused &&
              <button className="btn btn-secondary" onClick={this.play.bind(this)}>Play</button>
            }
            {
              this.state.canCheck &&
              <Link to={{ pathname: "/check", state: { text: this.state.text } }} className="btn btn-secondary">
                Check your writing
              </Link>
            }
          </div>
        </div>
      </div>
    )
  }

}
