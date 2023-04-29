// lib/speechToText.ts
import { SpeechClient, protos } from '@google-cloud/speech';
import { error } from 'console';

const client = new SpeechClient();

export const transcribeAudio = async (audioBuffer: Buffer): Promise<string> => {
    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: {
            content: audioBuffer.toString('base64'),
        },
        config: {
            encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3,
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        },
    };

    const [response] = await client.recognize(request);
    if (!response.results) {
        throw error
    }
    const transcription = response.results
        .map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) => result.alternatives?.[0]?.transcript || '')
        .join(' ');

    return transcription;
};
