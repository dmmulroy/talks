open Js

let (let*) t f = Promise.then_ f t

let main article =
  let* { text } = Ai.generateText
    {
      model = Open_ai.model Gpt_4o;
      system =
        "You are a professional writer. You write simple, clear, and concise \
         content.";
      prompt =
        "Summarize the following article in 3-5 sentences: " ^
          article;
    } 
  in
  Console.log text;
  Promise.resolve  ()
;;


