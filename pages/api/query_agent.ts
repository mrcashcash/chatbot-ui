import { ChatBody } from '@/types/chat';
import type { NextApiRequest, NextApiResponse } from 'next';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('beginning GET handler');
    const { messages, key, model, prompt, temperature } =
        req.body as ChatBody;
    const userMessage = messages[messages.length - 1];
    console.log('handler chatfile query: ', userMessage);

    if (userMessage) {
        let queryString = [
            `message=${userMessage.content}`,
            // `param2=${getParam(2)}`,
            // `param3=${getParam(3)}`,
        ].join('&');
        const streamUrl = `http://127.0.0.1:5000/query?${queryString}`;

        try {
            const response = await fetch(streamUrl);

            if (response.ok) {

                if (response.body) {
                    const reader = response.body.getReader()
                    const decoder = new TextDecoder("utf-8");

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        const token = decoder.decode(value);
                        res.write(token)
                    }
                    res.status(200).end()

                } else {
                    console.error('Error fetching stream: response body is null');
                    return new Response('Error fetching stream', { status: 500, });
                }
                //         // return res.status(200)
            } else {
                console.error('Error fetching stream:', response.statusText);
                return new Response('Error fetching stream', { status: response.status, });
            }
        } catch (error) {
            console.error('Error fetching stream:', error);
            return new Response('Error fetching stream', { status: 500, });
        }
    } else {
        return new Response('Invalid message parameter', { status: 400, });
    }
};

export default handler;
