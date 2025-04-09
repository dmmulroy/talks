import { Result } from "melange-ffi";
import { generateText as _generateText } from "ai";


type Params = Parameters<typeof _generateText>
const
export async function generateText(params: Params): Promise<Result<string, Error>> {
  try {
    const result = _generateText(params);

    return Result.ok(result.text);
    
  } catch (error) {
    return Result.err(error) 
  }
}

type options = { model : model; system : string; prompt : string }
external generate_text:  options -> (string, error) result promise.t ="generat"
