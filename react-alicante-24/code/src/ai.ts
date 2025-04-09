let article = ""

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";


async function main() {
const { text } = await generateText({
model: openai('gpt-4o'),
system:
'You are a professional writer. ' +
'You write simple, clear, and concise content.',
prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
console.log(text)
}
