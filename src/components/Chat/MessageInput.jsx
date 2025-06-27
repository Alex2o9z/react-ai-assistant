import { useReducer, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'classnames';
import { Paperclip, Mic, Square, Send, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import useRecorder from '@/hooks/useRecorder';
import FileUploadPreviewBox from '@/components/Utils/FileUploadPreviewBox';
import { Button } from '@/components/ui/button';
import LiveWaveform from '@/components/audio/LiveWaveform';

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const fileStates = [
    'input-file',
    'input-file-selected',
    'input-file-uploaded',
    'input-audio-uploaded',
    'input-url',
];

const initialState = (stateProp = 'default') => ({
    state: stateProp,
    files: [],
    loading: false,
    dragOver: false,
});

function reducer(state, action) {
    switch (action.type) {
        case 'click':
            return { ...state, state: 'input-file', files: state.files };
        case 'click_91':
            return { ...state, state: 'input-speech', files: [] };
        case 'cancel':
            return { ...state, state: 'default', files: [] };
        case 'file-selected':
            const newFiles = [...state.files, ...action.payload];
            if (newFiles.length > 10) {
                alert("Chỉ được phép chọn tối đa 10 file.");
                return state;
            }
            return { ...state, state: 'input-file-selected', files: newFiles };
        case 'remove-file':
            return { ...state, files: state.files.filter((_, i) => i !== action.payload) };
        case 'audio-recorded':
            return { ...state, state: 'default', files: [action.payload] };
        case 'url-entered':
            return { ...state, state: 'input-url', files: [] };
        case 'upload-start':
            return { ...state, loading: true };
        case 'upload-success':
            return { ...state, state: action.resultType, loading: false };
        case 'upload-failed':
            return { ...state, loading: false };
        case 'drag-enter':
            return { ...state, dragOver: true };
        case 'drag-leave':
            return { ...state, dragOver: false };
        case 'drop':
            const droppedFiles = [...state.files, ...action.payload];
            if (droppedFiles.length > 10) {
                alert("Chỉ được phép chọn tối đa 10 file.");
                return state;
            }
            return { ...state, dragOver: false, state: 'input-file-selected', files: droppedFiles };
        default:
            return state;
    }
}

function AutoResizeTextarea({ input, setInput, placeholder, className, onKeyDown, disabled, maxLength }) {
    const textareaRef = useRef(null);
    const mirrorRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const mirror = mirrorRef.current;

        if (textarea && mirror) {
            // Copy styles từ textarea sang mirror
            const computedStyle = window.getComputedStyle(textarea);
            mirror.style.width = `${textarea.clientWidth}px`;
            mirror.style.font = computedStyle.font;
            mirror.style.lineHeight = computedStyle.lineHeight;
            mirror.style.padding = computedStyle.padding;
            mirror.style.letterSpacing = computedStyle.letterSpacing;
            mirror.style.wordSpacing = computedStyle.wordSpacing;
            mirror.style.whiteSpace = computedStyle.whiteSpace;
            mirror.style.wordBreak = computedStyle.wordBreak;

            // Đặt nội dung cho mirror
            // mirror.textContent = input || ' '; // Thêm khoảng trắng để tránh chiều cao bằng 0 khi rỗng
            mirror.innerHTML = (input || ' ').replace(/\n$/g, '\n.').replace(/\n/g, '<br/>');

            // Đặt chiều cao cho textarea
            textarea.style.height = 'auto'; // Reset chiều cao

            const lineHeight = parseFloat(computedStyle.lineHeight); // Lấy line-height thực tế
            const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom); // Tổng padding
            const baseHeight = lineHeight + paddingY; // Chiều cao 1 dòng + padding
            const newHeight = (!input) ? baseHeight : Math.min(
                mirror.scrollHeight,
                window.innerWidth < 640 ? 120 : 160 // Giới hạn max-height
            );

            textarea.style.height = `${newHeight}px`;
        }
    }, [input]);

    return (
        <>
            {/* <textarea
                ref={textareaRef}
                placeholder={
                    currentState === 'input-speech' ? 'Recording...' : currentState === 'input-url' ? 'URL entered' : 'Enter chat here'
                }
                className="w-full outline-none bg-transparent font-normal text-slate-600 text-sm sm:text-base tracking-tight leading-[1.5] resize-none max-h-[120px] sm:max-h-[160px] overflow-y-auto"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={uploadLoading || isRecording}
                maxLength={50000}
            /> */}
            <textarea
                ref={textareaRef}
                placeholder={placeholder}
                // className="outline-none bg-transparent text-sm leading-[1.5] resize-none max-h-[120px] sm:max-h-[160px] overflow-y-auto w-full"
                className={className}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={disabled}
                maxLength={maxLength}
            />
            {/* Mirror element ẩn */}
            <div
                ref={mirrorRef}
                className="absolute invisible pointer-events-none"
                style={{
                    whiteSpace: 'pre-wrap', // Hỗ trợ wrap line
                    wordBreak: 'break-word',
                }}
            />
        </>
    );
}

export default function MessageInput({ stateProp, input, setInput, onSend, handleUpload, uploadLoading }) {
    const { sessionId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState(stateProp));
    const { state: currentState, files, loading, dragOver } = state;
    const { startRecording, stopRecording, isRecording } = useRecorder((file) => {
        console.log('Audio file recorded:', {
            name: file.name,
            size: file.size,
            type: file.type,
            isFile: file instanceof File,
        });
        dispatch({ type: 'audio-recorded', payload: file });
        onSend({ type: 'audio', data: file });
    });

    const [urlInput, setUrlInput] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const textareaRef = useRef(null);
    const isMobile = window.innerWidth < 640;

    const debouncedSendText = useCallback(
        debounce((value) => {
            if (value.trim()) {
                onSend({ type: 'text', data: value });
                setInput('');
            }
        }, window.innerWidth < 640 ? 200 : 300),
        [onSend, setInput]
    );

    useEffect(() => {
        const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
        const trimmedUrl = urlInput.trim();
        if (urlPattern.test(trimmedUrl)) {
            dispatch({ type: 'url-entered' });
            setIsValidUrl(true);
        } else {
            if (currentState === 'input-url') {
                dispatch({ type: 'cancel' });
            }
            setIsValidUrl(false);
        }
    }, [urlInput, currentState]);

    // useEffect(() => {
    //     const textarea = textareaRef.current;
    //     if (textarea) {
    //         textarea.style.height = 'auto';
    //         const computedStyle = window.getComputedStyle(textarea);
    //         const lineHeight = parseFloat(computedStyle.lineHeight); // Lấy line-height thực tế
    //         const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom); // Tổng padding
    //         const baseHeight = lineHeight + paddingY; // Chiều cao 1 dòng + padding
    //         // textarea.style.height = input
    //         //     ? `${Math.min(textarea.scrollHeight, window.innerWidth < 640 ? 120 : 160)}px`
    //         //     : `${baseHeight}px`; // Nếu rỗng, set chiều cao 1 dòng

    //         const isWrapped = textarea.scrollHeight > textarea.clientHeight
    //             || (textarea.scrollHeight == textarea.clientHeight && textarea.scrollHeight > lineHeight)
    //             || input.includes('\n');

    //         textarea.style.height = input
    //             ? `${isWrapped
    //                 ? Math.min(textarea.scrollHeight, window.innerWidth < 640 ? 120 : 160)
    //                 : baseHeight
    //             }px`
    //             : `${baseHeight}px`;

    //         console.log(
    //             'scrollHeight:', textarea.scrollHeight,
    //             'clientHeight:', textarea.clientHeight,
    //             'lineHeight:', lineHeight,
    //             'paddingY:', paddingY,
    //             'isWrapped:', isWrapped
    //         );
    //     }
    // }, [input]);

    const handleUploadAction = async () => {
        dispatch({ type: 'upload-start' });
        try {
            const result = await handleUpload(files, urlInput, input);
            if (result.success) {
                dispatch({
                    type: 'upload-success',
                    resultType: files.some((f) =>
                        f.type.startsWith('audio/') ||
                        f.type.startsWith('video/') ||
                        ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(
                            f.name.split('.').pop()?.toLowerCase()
                        )
                    ) ? 'input-audio-uploaded' : 'input-file-uploaded',
                });
                setUrlInput('');
                setInput('');
                setTimeout(() => dispatch({ type: 'cancel' }), 3000);
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('Upload failed:', err.message);
            alert('Upload failed: ' + err.message);
            dispatch({ type: 'upload-failed' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.composing) {
            e.preventDefault();
            if (isValidUrl || files.length > 0) {
                handleUploadAction();
            } else {
                debouncedSendText(input);
            }
        }
    };

    const handleRemoveFile = (index) => {
        dispatch({ type: 'remove-file', payload: index });
        if (state.files.length === 1) {
            dispatch({ type: 'cancel' });
        }
    };

    const isFileState = fileStates.includes(currentState);

    return (
        <div className="flex flex-col items-center gap-2 px-4 sm:px-8 md:px-16 lg:px-24 py-2 sm:py-4 md:py-6 relative self-stretch w-full">
            {(currentState === 'input-speech' || isRecording) && (
                <div className="flex items-center gap-3 relative self-stretch w-full">
                    <LiveWaveform
                        isRecording={isRecording}
                        setIsRecording={(val) => dispatch({ type: val ? 'click_91' : 'cancel' })}
                        onSend={(file) => onSend({ type: 'audio', data: file })}
                    />
                </div>
            )}
            {isFileState && (
                <div className="flex items-center gap-3 relative self-stretch w-full">
                    <div className="flex flex-col w-full px-5 py-2 bg-white rounded-[25px] justify-between items-center border border-gray-200 gap-2.5">
                        {/* <FileUploadPreviewBox
                            currentState={currentState}
                            files={files}
                            dragOver={dragOver}
                            onDragEnter={() => dispatch({ type: 'drag-enter' })}
                            onDragLeave={() => dispatch({ type: 'drag-leave' })}
                            onDrop={(files) => dispatch({ type: 'drop', payload: Array.from(files) })}
                            onFileSelect={(files) => dispatch({ type: 'file-selected', payload: Array.from(files) })}
                            onRemoveFile={handleRemoveFile}
                        /> */}
                        <FileUploadPreviewBox
                            currentState={currentState}
                            files={files}
                            dragOver={isMobile ? false : dragOver}
                            onDragEnter={isMobile ? null : () => dispatch({ type: 'drag-enter' })}
                            onDragLeave={isMobile ? null : () => dispatch({ type: 'drag-leave' })}
                            onDrop={isMobile ? null : (files) => dispatch({ type: 'drop', payload: Array.from(files) })}
                            onFileSelect={(files) => dispatch({ type: 'file-selected', payload: Array.from(files) })}
                            onRemoveFile={handleRemoveFile}
                        />
                        <div className="flex w-full items-start justify-center gap-2.5">
                            <div className="flex items-center justify-around gap-2.5 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white border border-gray-200 rounded-[25px] flex-1">
                                <input
                                    type="text"
                                    placeholder="Enter URL here"
                                    className="flex-1 text-sm text-black font-normal outline-none bg-transparent"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={uploadLoading}
                                />
                            </div>
                            {(currentState === 'input-file-selected' || currentState === 'input-url') && (
                                <Button
                                    className="bg-primary text-white px-2 py-1"
                                    onClick={handleUploadAction}
                                    disabled={uploadLoading || (files.length === 0 && !isValidUrl)}
                                >
                                    {uploadLoading ? 'Uploading...' : 'Upload'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-end gap-1.5 sm:gap-2 lg:gap-3 relative self-stretch w-full">
                <Button
                    className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full"
                    onClick={() => dispatch({ type: isFileState ? 'cancel' : 'click' })}
                    aria-label={isFileState ? 'Cancel file upload' : 'Attach file'}
                >
                    {isFileState ? <X className="!w-6 !h-6 sm:!w-7 sm:!h-7 text-white" /> : <Paperclip className="!w-6 !h-6 sm:!w-7 sm:!h-7 text-white" />}
                </Button>
                <div className="flex items-end gap-2.5 p-1 pl-3 relative flex-1 bg-white rounded-4xl border border-solid border-slate-300 shadow-sm">
                    <div className="flex items-center gap-2 my-auto px-1 sm:px-2.5 py-0 flex-1">
                        {/* <input
                            type="text"
                            placeholder={
                                currentState === 'input-speech' ? 'Recording...' : currentState === 'input-url' ? 'URL entered' : 'Enter chat here'
                            }
                            className="relative flex-1 mt-[-1.00px] outline-none bg-transparent [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-slate-600 text-base tracking-[0] leading-[25.6px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={uploadLoading || isRecording}
                        /> */}
                        {/* <textarea
                            ref={textareaRef}
                            placeholder={
                                currentState === 'input-speech' ? 'Recording...' : currentState === 'input-url' ? 'URL entered' : 'Enter chat here'
                            }
                            className="w-full outline-none bg-transparent font-normal text-slate-600 text-sm sm:text-base tracking-tight leading-[1.5] resize-none max-h-[120px] sm:max-h-[160px] overflow-y-auto"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={uploadLoading || isRecording}
                            maxLength={50000}
                        /> */}
                        <AutoResizeTextarea
                            input={input}
                            setInput={setInput}
                            placeholder={
                                currentState === 'input-speech' ? 'Recording...' : currentState === 'input-url' ? 'URL entered' : 'Enter chat here'
                            }
                            className="w-full outline-none bg-transparent font-normal text-slate-600 text-sm sm:text-base tracking-tight leading-[1.5] resize-none max-h-[120px] sm:max-h-[160px] overflow-y-auto"
                            onKeyDown={handleKeyDown}
                            disabled={uploadLoading || isRecording}
                            maxLength={50000}
                        />
                    </div>
                    <Button
                        className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full"
                        onClick={async () => {
                            if (currentState === 'input-speech' && isRecording) {
                                await stopRecording();
                            } else {
                                await startRecording();
                                dispatch({ type: 'click_91' });
                            }
                        }}
                        disabled={uploadLoading}
                    >
                        {currentState === 'input-speech' && isRecording ? (
                            <Send className="!w-5 !h-5 sm:!w-6 sm:!h-6 text-white" />
                        ) : (
                            <Mic className="!w-5 !h-5 sm:!w-6 sm:!h-6 text-white" />
                        )}
                    </Button>
                    {/* {currentState !== 'input-speech' && !isRecording && !file && (
                        <Button
                            className="rounded-full"
                            onClick={async () => {
                                await startRecording(); // bạn nên await ở đây
                                dispatch({ type: 'click_91' });
                            }}
                            disabled={uploadLoading}
                        >
                            <Mic className="!w-6 !h-6" color="#FFFFFF" />
                        </Button>
                    )}
                    {currentState === 'input-speech' && isRecording && (
                        <Button
                            className="rounded-full"
                            onClick={async () => {
                                await stopRecording(); // stop và tạo `file`
                            }}
                            disabled={uploadLoading}
                        >
                            <Square className="!w-6 !h-6" color="#FFFFFF" />
                        </Button>
                    )}
                    {currentState === 'input-speech' && file && !isRecording && (
                        <Button
                            className="rounded-full"
                            onClick={handleAudioSend}
                            disabled={uploadLoading}
                        >
                            <Send className="!w-6 !h-6" color="#FFFFFF" />
                        </Button>
                    )} */}
                </div>
            </div>
        </div>
    );
}

MessageInput.propTypes = {
    stateProp: PropTypes.oneOf([
        'default',
        'input-file',
        'input-file-selected',
        'input-file-uploaded',
        'input-audio-uploaded',
        'input-speech',
        'input-url',
    ]),
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    handleUpload: PropTypes.func.isRequired,
    uploadLoading: PropTypes.bool.isRequired,
};