# Outline

- Title
- Speaker Info
- Agenda
- The problem with TypeScript
  - Happy path blindness
  - Throw/Try Catch in the 🗑️: Errors are unknown
  - Example/Rhys joke
- The power of an Error
  - Self-Serve renewals initial state
    - Example of commonplace error messages/user experiences
    - Self-Serve renewals current state
      - Example of current state error messages
    - Wix Engineering example
- Our responsibility as devs
- Treating errors as values
  - React Query & SWR example
  - Type unsafety w/ React Query & SWR
- Intro to Result<Ok, Err>
  - Baseline (no try-catch)
  - Baseline (try/catch)
  - Promise<Domain | Error>
  - Promise.allSettled (too verbose)
  - Discriminated union
  - Result<A,E> (aka Monad 🤫)
  - Maybe show safeTry `neverthrow` api 
  - Link to YT video of implementing Result from scratch
- The two kinds of Errors
  - Expected errors
  - Defects (compare to panics?)
- TaggedError 
  - Fewer foot guns & exhaustiveness checks (Maybe .match?)
- Error boundaries
- RSCs, ServerActions, FormActions
- Summary + Monad Joke
  


