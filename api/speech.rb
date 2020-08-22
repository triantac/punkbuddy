require 'google/cloud/text_to_speech'
require 'base64'

client = Google::Cloud::TextToSpeech.text_to_speech

Handler = Proc.new do |req, res|
  voice = {
    language_code: 'en-GB',
    ssml_gender:   'NEUTRAL'
  }

  text = req.query['text'].to_s

  synth_res = client.synthesize_speech(
    input: { text: text },
    voice: voice,
    audio_config: { audio_encoding: 'MP3' }
  )

  # TODO: base64 is a workaround for the non-utf8 encoding issue :(
  res['Content-Type'] = 'text/text'
  res.body = Base64.encode64(synth_res.audio_content)
end
