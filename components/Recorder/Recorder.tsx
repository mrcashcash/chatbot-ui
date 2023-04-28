// components/AudioRecorder.tsx
import { IconMicrophone } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';

interface AudioRecorderProps {
    onUpdateTranscript: (transcript: string) => void;
    onStopRecording: () => void;
    onStartRecording: () => void;
    resetSignal: boolean;
}
export const AudioRecorder: React.FC<AudioRecorderProps> = ({
    onUpdateTranscript,
    onStopRecording,
    onStartRecording,
    resetSignal }) => {
    const [isRecording, setIsRecording] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        console.log("Rcorder:Start Recording...")
        onStartRecording();

        setIsRecording(true);
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            console.error('Your browser does not support speech recognition.');
            return;
        }
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopRecording = () => {
        console.log("Rcorder:Stop Recording...")
        setIsRecording(false);
        SpeechRecognition.stopListening();
        onUpdateTranscript(transcript);
        resetTranscript();
        onStopRecording();
    };
    useEffect(() => {
        if (isRecording) {
            onUpdateTranscript(transcript);
            console.log("Recorder:uEff:[transcript, onUpdateTranscript, isRecording]")
        }
    }, [transcript, onUpdateTranscript, isRecording]);

    // useEffect(() => {
    //     console.log("Recorder:uEff:[resetSignal, resetTranscript]-resetSignal-main-before-true?")
    //     if (resetSignal) {
    //         console.log("Recorder:uEff:[resetSignal, resetTranscript]-resetSignal-true")
    //         resetTranscript();
    //     }
    // }, [resetSignal, resetTranscript]);

    return (

        <div className="absolute right-8 top-2">
            <button
                onClick={toggleRecording}
                className={`${isRecording ? 'text-red-600' : 'text-blue-600'
                    } rounded-sm p-1 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:hover:text-neutral-200 focus:outline-none`}
            >
                <IconMicrophone size={18} />
            </button>
        </div>
    );
};
