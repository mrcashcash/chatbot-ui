import { MSG_TYPE } from '@/utils/app/const';
import React, { useState } from 'react';

interface CustomInputModalProps {
    inputType: MSG_TYPE;
    showModal: boolean;
    closeModal: () => void;
    inputLabel1: string;
    inputLabel2: string;
    handleFormValues: (inputType: MSG_TYPE, inputValue1: string, inputValue2: string, inputValue3: string) => void;

}

const CustomInputModal: React.FC<CustomInputModalProps> = ({ inputType, showModal, closeModal, inputLabel1, inputLabel2, handleFormValues }) => {
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');
    const [inputError1, setInputError1] = useState(''); // New error state
    const [inputError2, setInputError2] = useState(''); // New error state
    const [inputError3, setInputError3] = useState(''); // New error state

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        const stringNoSymbolsOrSpaces = /^[a-zA-Z0-9]+$/;

        let isValid = true;

        if (!inputValue1) {
            setInputError1(inputLabel1 + ' is required.');
            isValid = false;
        } else if (inputType !== MSG_TYPE.GOOGLE_SEARCH && !urlRegex.test(inputValue1)) {
            setInputError1(inputLabel1 + ' must be a valid website link.');
            isValid = false;
        } else {
            setInputError1('');
        }
        if (inputValue2 && typeof inputValue2 !== 'string') {
            setInputError2(inputLabel2 + ' must be a string.');
            isValid = false;
        } else {
            setInputError2('');
        }

        if (!inputValue3 || !stringNoSymbolsOrSpaces.test(inputValue3)) {
            setInputError3('VectorStore Name is required and must contain only characters and numbers (no symbols or spaces).');
            isValid = false;
        } else {
            setInputError3('');
        }

        if (isValid) {
            handleFormValues(inputType, inputValue1, inputValue2, inputValue3);
            closeModal();
        }
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-800 p-4 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-semibold mb-1">{inputLabel1}:</label>
                        <input
                            type="text"
                            value={inputValue1}
                            onChange={(e) => setInputValue1(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded text-neutral-100 dark:text-gray-900"
                        />
                        {inputError1 && <p className="mt-1 text-xs text-red-600">{inputError1}</p>}
                    </div>
                    {inputType != MSG_TYPE.GOOGLE_SEARCH && <div className="mb-3">
                        <label className="block text-sm font-semibold mb-1">{inputLabel2}:</label>
                        <input
                            type="text"
                            value={inputValue2}
                            onChange={(e) => setInputValue2(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded text-neutral-100 dark:text-gray-900"
                        />
                        {inputError2 && <p className="mt-1 text-xs text-red-600">{inputError2}</p>}
                    </div>}

                    <div className="mb-3">
                        <label className="block text-sm font-semibold mb-1">VectorStore Name:</label>
                        <input
                            type="text"
                            value={inputValue3}
                            onChange={(e) => setInputValue3(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded text-neutral-100 dark:text-gray-900"
                        />
                        {inputError3 && <p className="mt-1 text-xs text-red-600">{inputError3}</p>}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-200 dark:bg-neutral-600 text-sm text-gray-700 dark:text-neutral-200 px-4 py-2 rounded mr-2"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 dark:bg-blue-700 text-sm text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomInputModal;
