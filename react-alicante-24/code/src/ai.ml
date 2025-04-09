type model = [ `OpenAi of Open_ai.t | `Anthropic of Anthropic.t]

type options = { model : model; system : string; prompt : string }

type generate_text_result = { text : string }


external generateText : options -> generate_text_result Js.Promise.t
  = "generateText"
[@@mel.module "ai"]
