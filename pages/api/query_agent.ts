import { NextApiRequest, NextApiResponse } from "next";
import { Calculator } from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Readable, ReadableOptions } from "stream";
import { ChatBody } from "@/types/chat";
import { OpenAIChat } from "langchain/llms/openai";
import { OPENAI_API_KEY } from "@/utils/app/const";
import { Transform } from "stream";

export class TokenStream extends Transform {
    private buffer: string = "";

    constructor(options: any) {
        super(options);
    }

    _transform(chunk: any, encoding: any, callback: any) {
        const data = chunk.toString();
        if (!data) {
            callback();
            return;
        }
        this.buffer += data;

        console.log("pushing buffer:", this.buffer);
        this.push(this.buffer);
        this.buffer = '';

        callback();
    }

    _flush(callback: any) {
        callback();
    }
}









const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { messages, key, model, prompt, temperature } = req.body as ChatBody;
        const userMessage = messages[messages.length - 1];
        const query = userMessage.content.trim();
        const tools = [new Calculator()];

        const tokenStream = new TokenStream({ highWaterMark: 1, });

        const llm = new OpenAIChat({
            modelName: model.id,
            openAIApiKey: OPENAI_API_KEY,
            temperature: temperature,
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token: string) {
                        tokenStream.push(token);
                    },
                },
            ],
        });

        const executor = await initializeAgentExecutorWithOptions(tools, llm, {
            agentType: "zero-shot-react-description",
            verbose: true,
        });
        // console.log("Loaded agent.");

        const input = query;
        // console.log(`Executing with input "${input}"...`);
        const result = await executor.call({ input });

        // console.log(`Got output ${result.output}`);

        tokenStream.push(null); // Signal the end of the stream.

        res.setHeader("Content-Type", "text/plain");
        res.flushHeaders(); // Send the headers immediately.

        tokenStream.pipe(res); // Pipe the token stream as response.
    } catch (error) {
        console.error(error);
        res.status(500).send("Error: TEST AI");
    }
};

export default handler;


// import { ChatBody } from '@/types/chat';
// import { OpenAI } from '@/types/openai';

// const handler = async (req: Request): Promise<Response> => {
//     try {
//         const { messages, key, model, prompt, temperature } =
//             await req.json() as ChatBody;
//         let answer;
//         const userMessage = messages[messages.length - 1];
//         const messagesArray = messages.map(
//             (message) => `\${message.role}:\${message.content}`
//         );
//         const chat_history = messages.pop();
//         const query = userMessage.content.trim();

//         // Create a readable stream controller
//         const streamController = new ReadableStreamController();

//         const llm = new OpenAI({
//             modelName: model.id,
//             openAIApiKey: OPENAI_API_KEY,
//             temperature: temperature,
//             streaming: true,
//             callbacks: [
//                 {
//                     handleLLMNewToken(token: string) {
//                         console.log({ token });

//                         // Enqueue the token to the readable stream
//                         streamController.enqueue(token);
//                     },
//                 },
//             ],
//         });

//         // Create a readable stream using the controller
//         const readableStream = new ReadableStream({
//             start(controller: ReadableStreamController) {
//                 streamController = controller;
//             },
//         });

//         // Return a Response object with the readable stream as the body
//         return new Response(readableStream, {
//             headers: { 'Content-Type': 'text/plain' },
//         });
//     } catch (error) {
//         console.error(error);
//         return new Response('Error', { status: 500 });
//     }
// };
