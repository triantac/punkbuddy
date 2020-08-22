require 'google/cloud/language'
require 'json'

language = Google::Cloud::Language.language_service

Handler = Proc.new do |req, res|

  text = req.query['text'].to_s
  document = { content: text, type: :PLAIN_TEXT }

  syntax_res = language.analyze_syntax document: document

  adjectives = []

  cur_char = 0
  cur_text = text
  # was the previous token an adjective?
  prev_adj = false

  for token in syntax_res.tokens
    # p token.text.content
    offset = token.text.begin_offset
    length = token.text.content.length
    if token.part_of_speech.tag == :ADJ
      adjectives << {:offset => cur_char, :length => length} if prev_adj
      prev_adj = true
    else
      prev_adj = false
    end
    
    # now move on to the next word
    matches = /\b.+?\b.+?\b/.match(cur_text)
    if matches != nil
      to_trim = matches[0].length
      cur_char += to_trim
      cur_text = cur_text[to_trim..-1]
    end
  end

  res.body = JSON.generate({:chainedAdjectives => adjectives})
end
