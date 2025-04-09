type t =  Gpt_4o_mini | Gpt_4o | Gpt_4_turbo | Gpt_4

let to_string = function
    | Gpt_4o_mini -> "gpt-4o-mini"
    | Gpt_4o -> "gpt-4o"
    | Gpt_4_turbo -> "gpt-4-turbo"
    | Gpt_4 -> "gpt-4"

external open_ai : string -> [>`OpenAi of t]
  = "openai"
[@@mel.module "@ai-sdk/openai"]

let model name = to_string name |> open_ai


