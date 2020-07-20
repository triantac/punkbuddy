import React from "react"

interface IWriteState {
  text: string
  loading: boolean
  listensRemaining: number
}

export default class Write extends React.Component<Readonly<{}>, IWriteState> {


  constructor(props: Readonly<Readonly<{}>>) {
    super(props)
    this.state = {
      text: 'Hello',
      loading: false,
      listensRemaining: 3
    }
  }

  render() {
    const speak = async () => {
      if (this.state.listensRemaining <= 0 || this.state.loading)
        return;

      this.setState({ loading: true, listensRemaining: this.state.listensRemaining - 1 })
      try {
        // IMPORTANT! Need to create the Audio ASAP otherwise the anti-autoplay
        // feature in browsers will block the call to play at the bottom, so
        // create it before the fetch
        const audio = new Audio()
        const req = await fetch(`/api/speech?text=${this.state.text}`)
        const base64 = await req.text()
        audio.src = `data:audio/mpeg3;base64,${base64}`
        audio.play()
      } finally {
        this.setState({ loading: false })
      }
    }

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
        <div className="form-group">
          <textarea className="form-control" onChange={textareaChanged}
            rows={6}></textarea>
        </div>
        <button className={`btn btn-primary ${speakDisabled ? "disabled" : ""}`}
          onClick={speak}>{speakButtonText}</button>
      </div>
    )
  }

}
