import { processQuery } from "@/utils/server/llm";
import endent from "endent";
import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "langchain/document";
import { ChatBody, Message } from '@/types/chat';
import { OPENAI_API_HOST } from "@/utils/app/const";


const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { messages, key, model } =
            req.body as ChatBody;

        const userMessage = messages[messages.length - 1];
        const query = encodeURIComponent(userMessage.content.trim());
        const docs: Document[] = await processQuery(query)
        const answerPrompt = endent`
    Provide me with the information I requested. Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as a markdown link as you use them at the end of each sentence by number of the source (ex: [[1]](link.com or /exapmle/file.txt)). Provide an accurate response and then stop. Today's date is ${new Date().toLocaleDateString()}.

    Example Input:
    What's the weather in San Francisco today?

    Example Sources:
    (google.com/search/cooler.html) : DATA CONTENT

    Example Response:
    It's 70 degrees and sunny in San Francisco today. [[1]](google.com/search/cooler.html)

    Input:
    ${userMessage.content.trim()}

    Sources:
    ${docs.map((doc) => {
            return endent`
      (${doc.metadata.source}): ${doc.pageContent}
      `;
        })}

    Response:
    `;
        const answerMessage: Message = { role: 'user', content: answerPrompt };
        const answerRes = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
                ...(process.env.OPENAI_ORGANIZATION && {
                    'OpenAI-Organization': process.env.OPENAI_ORGANIZATION,
                }),
            },
            method: 'POST',
            body: JSON.stringify({
                model: model.id,
                messages: [
                    {
                        role: 'system',
                        content: `Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as [1](link), etc, as you use them. Maximum 4 sentences.`,
                    },
                    answerMessage,
                ],
                max_tokens: 1000,
                temperature: 1,
                stream: false,
            }),
        });
        const { choices: choices2 } = await answerRes.json();
        const answer = choices2[0].message.content;

        res.status(200).json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' })
    }
}
export default handler