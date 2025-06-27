import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CheckCheck, FileText, Link } from 'lucide-react';
import { getAudio } from '@/services/speechServices';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WaveformPlayer from '@/components/audio/WaveformPlayer';

// Custom components for Markdown rendering
const components = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code className="bg-gray-100 text-red-600 px-1 rounded overflow-x-auto" {...props}>
                {children}
            </code>
        );
    },
    p({ children }) {
        return <p className="mb-1 leading-tight whitespace-pre-wrap">{children}</p>;
    },
    h1({ children }) {
        return <h1 className="text-2xl font-bold mb-2">{children}</h1>;
    },
    h2({ children }) {
        return <h2 className="text-xl font-bold mb-2">{children}</h2>;
    },
    h3({ children }) {
        return <h3 className="text-lg font-bold mb-2">{children}</h3>;
    },
    ul({ children }) {
        return <ul className="list-disc pl-5 mb-2">{children}</ul>;
    },
    ol({ children }) {
        return <ol className="list-decimal pl-5 mb-2">{children}</ol>;
    },
    a({ href, children }) {
        return (
            <a href={href} className="text-accent underline" target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    },
};
const shouldUsePre = (text) => {
    if (!text) return false;

    // Bỏ qua nếu là code block hoặc bảng Markdown
    if (text.match(/^```[\s\S]*```$/m) || text.match(/^\|[^\n]*\|/m)) {
        return false;
    }

    // Bỏ qua nếu chứa cú pháp danh sách Markdown
    if (text.match(/^\s*[*+-]\s/m)) {
        return false; // Ưu tiên Markdown cho danh sách
    }

    // Phát hiện ASCII art: nhiều ký tự đặc biệt hoặc cấu trúc đặc trưng
    const lines = text.split('\n');
    const hasAsciiArt = lines.length >= 2 && lines.some(line =>
        line.match(/^[^\w\s]{3,}/) || // Nhiều ký tự đặc biệt liên tục
        (line.match(/^\s{2,}[^\s]/) && !line.match(/^\s*[*+-]\s/)) // Thụt dòng nhưng không phải danh sách Markdown
    );

    // Phát hiện code không Markdown (cấu trúc lập trình rõ ràng)
    const hasCodeLike = text.match(/^\s*(function|def|class|interface|type|\{|\})\s*/m);

    return hasAsciiArt || hasCodeLike;
};

const preprocessText = (text) => {
    if (!shouldUsePre(text) && !text.match(/^```[\s\S]*$/m)) {
        return text.replace(/\n/g, '<br>');
    }
    return text;
};

const RenderMessageContent = ({ text }) => {
    if (!text) {
        return <div className="text-sm text-gray-500">No content</div>;
    }

    const sanitizedText = DOMPurify.sanitize(text);

    if (shouldUsePre(sanitizedText)) {
        return (
            <pre className={`mb-1 font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto`}>
                {sanitizedText}
            </pre>
        );
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={components}
        >
            {preprocessText(sanitizedText)}
        </ReactMarkdown>
    );
};

export const ChatBubble = memo(({
    isAvatar = false,
    avatarSrc,
    type,
    message,
    audio,
    audioTimestamp,
    latestAudioRef,
    isLatest,
    text = 'Message',
    time = '11:25',
}) => {
    const image =
        'https://www.techsmith.com/blog/wp-content/uploads/2023/08/What-are-High-Resolution-Images.png';
    const shouldAutoPlay = type === 'sender' && (audio || audioTimestamp);
    const audioSrc = audio || getAudio(`audio_${audioTimestamp}`) || '';
    const sanitizedText = DOMPurify.sanitize(text);

    return (
        <div
            className={`items-start gap-2 relative max-w-5/6 flex ${type === 'recipient' ? 'justify-end flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            {avatarSrc && isAvatar ? (
                <Avatar className={`w-10 h-10`}>
                    {/* <img
                        data-indicator="None"
                        data-size="md"
                        data-type="Image"
                        className="w-10 h-10 relative rounded-[76.88px]"
                        src={avatarSrc}
                    /> */}
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            ) : (
                <div
                    data-indicator="None"
                    data-size="md"
                    data-type="Text"
                    className="w-10 h-10 relative bg-sidebar border border-sidebar-border rounded-[76.88px]"
                >
                    <div className="w-10 left-0 top-[9px] absolute text-center justify-start text-accent-foreground text-base font-extrabold [font-family:'Plus_Jakarta_Sans-ExtraBold',Helvetica] leading-snug">
                        AI
                    </div>
                </div>
            )}

            {/* Message */}
            <div
                className={`rounded-2xl relative 
          ${type === 'sender' ? 'border border-solid border-slate-200 bg-white' : 'bg-primary'} 
          flex flex-1 p-3
          ${message === 'file-upload' || message === 'image-video' || message === 'link-image' || message === 'link-text' || message === 'recording' || message === 'reply' || message === 'text-fill' ? 'flex-col' : ''}
          ${['recording', 'text-hug', 'typing'].includes(message) ? 'items-center justify-center' : 'items-end justify-end'}
          ${['file-upload', 'image-video', 'link-image', 'link-text', 'reply', 'text-fill'].includes(message) ? 'grow' : ''} 
          ${message === 'text-hug' ? 'gap-2.5' : ['recording', 'reply', 'typing'].includes(message) ? 'gap-2' : 'gap-1'} 
          ${['file-upload', 'image-video', 'link-image', 'link-text', 'recording', 'reply', 'text-fill', 'text-hug', 'typing'].includes(message) ? 'overflow-hidden' : ''}`}
            >
                {(message === 'file-upload' ||
                    message === 'image-video' ||
                    message === 'link-image' ||
                    message === 'link-text' ||
                    message === 'recording' ||
                    message === 'reply' ||
                    message === 'text-fill' ||
                    message === 'text-hug') && (
                        <>
                            <div
                                className={`relative mt-[-1.00px] ${type === 'sender' ? 'text-slate-800' : 'text-white'} leading-5 [font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm self-stretch tracking-[-0.08px]`}
                            >
                                {message === 'recording' && (
                                    <>
                                        <RenderMessageContent text={text} />
                                        {message === 'recording' && (audio || audioTimestamp) && (
                                            <WaveformPlayer audioUrl={audioSrc} />
                                        )}
                                    </>
                                )}
                                {['text-fill', 'text-hug'].includes(message) && (
                                    <RenderMessageContent text={text} />
                                )}
                            </div>

                            <div
                                className={`relative 
                ${message === 'reply' && type === 'recipient' ? 'border-white' : message === 'reply' && type === 'sender' ? 'border-indigo-600' : (message === 'file-upload' && type === 'recipient') || (message === 'image-video' && type === 'recipient') || (message === 'link-image' && type === 'recipient') || (message === 'link-text' && type === 'recipient') ? 'border-indigo-500' : (message === 'file-upload' && type === 'sender') || (message === 'image-video' && type === 'sender') || (message === 'link-image' && type === 'sender') || (message === 'link-text' && type === 'sender') ? 'border-slate-200' : ''} 
                ${['file-upload', 'image-video', 'link-text', 'reply'].includes(message) ? 'flex items-center' : message === 'recording' ? 'inline-flex items-center' : ''} 
                ${message === 'reply' && type === 'sender' ? 'border-l' : ''} 
                ${message === 'reply' && type === 'recipient' ? 'border-r' : ''} 
                ${type === 'recipient' && ['text-fill', 'text-hug'].includes(message) ? 'text-white' : type === 'sender' && ['text-fill', 'text-hug'].includes(message) ? 'text-slate-800' : ''} 
                ${['file-upload', 'link-text', 'reply'].includes(message) ? 'p-3' : message === 'image-video' ? 'px-8 py-16' : ''} 
                ${['image-video', 'link-image'].includes(message) ? 'bg-[50%_50%]' : ''} 
                ${['text-fill', 'text-hug'].includes(message) ? `leading-5 [font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[-0.08px]` : ''} 
                ${message === 'reply' && type === 'recipient' ? '[border-right-style:solid]' : ''} 
                ${message === 'text-hug' ? 'w-fit' : ['file-upload', 'image-video', 'link-image', 'link-text', 'reply'].includes(message) ? 'w-full' : ''} 
                ${['file-upload', 'link-text'].includes(message) ? 'flex-col' : ''} 
                ${message === 'image-video' && type === 'recipient' ? 'bg-[url(/frame.png)]' : message === 'image-video' && type === 'sender' ? 'bg-[url(/frame-2.png)]' : type === 'recipient' && message === 'link-image' ? 'bg-[url(/image.png)]' : message === 'link-image' && type === 'sender' ? 'bg-[url(/frame-3.png)]' : ''} 
                ${message === 'reply' && type === 'sender' ? '[border-left-style:solid]' : ''} 
                ${type === 'recipient' && ['file-upload', 'link-text', 'reply'].includes(message) ? 'bg-indigo-700' : message === 'reply' && type === 'sender' ? 'bg-slate-100' : type === 'sender' && ['file-upload', 'link-text'].includes(message) ? 'bg-slate-50' : ''} 
                ${['file-upload', 'image-video', 'link-image', 'link-text'].includes(message) ? 'border border-solid' : ''} 
                ${['file-upload', 'image-video', 'link-image', 'link-text', 'reply', 'text-fill'].includes(message) ? 'self-stretch' : ''} 
                ${message === 'link-image' ? 'h-48' : ''} 
                ${['file-upload', 'image-video', 'link-text', 'reply'].includes(message) ? 'overflow-hidden' : ''} 
                ${['file-upload', 'image-video', 'link-text', 'recording'].includes(message) ? 'justify-center' : ''}`}
                            >
                                {['file-upload', 'image-video', 'link-text', 'reply'].includes(message) && (
                                    <div
                                        className={`relative 
                    ${message === 'image-video' ? 'border-[#ffffff52] [-webkit-backdrop-filter:blur(8px)_brightness(100%)] backdrop-blur backdrop-brightness-[100%] w-16 h-16 rounded-[123px]' : ''} 
                    ${['file-upload', 'image-video', 'link-text'].includes(message) ? 'flex' : ''} 
                    ${message === 'reply' ? `mt-[-1.00px] flex-1 leading-5 [font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[-0.08px]` : ''} 
                    ${message === 'image-video' ? 'items-center justify-center gap-2.5' : ['file-upload', 'link-text'].includes(message) ? 'items-start' : ''} 
                    ${['file-upload', 'link-text'].includes(message) ? 'w-full self-stretch gap-2' : ''} 
                    ${message === 'image-video' ? 'bg-[#02061752]' : ''} 
                    ${message === 'image-video' ? 'border border-solid' : ''} 
                    ${message === 'reply' && type === 'recipient' ? 'text-white' : message === 'reply' && type === 'sender' ? 'text-slate-800' : ''}`}
                                    >
                                        {message === 'reply' && (
                                            <RenderMessageContent text={text} />
                                        )}
                                        {message === 'image-video' && <Play className="!relative !w-8 !h-8" />}
                                        {type === 'recipient' && message === 'file-upload' && <FileText className="!relative !w-8 !h-8" />}
                                        {message === 'file-upload' && type === 'sender' && <FileText className="!relative !w-8 !h-8" />}
                                        {['file-upload', 'link-text'].includes(message) && (
                                            <div className="flex flex-col items-start grow gap-1 flex-1 relative">
                                                <div
                                                    className={`[font-family:'Plus_Jakarta_Sans-Bold',Helvetica] self-stretch mt-[-1.00px] tracking-[-0.11px] text-base font-bold leading-[22px] relative ${type === 'recipient' ? 'text-white' : 'text-slate-800'}`}
                                                >
                                                    {message === 'file-upload' && <>Account_report.docx</>}
                                                    {message === 'link-text' && <>External Link Title</>}
                                                </div>
                                                <div
                                                    className={`[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] tracking-[-0.06px] text-xs leading-4 relative ${['file-upload', 'link-text'].includes(message) && (message === 'file-upload' || type === 'recipient') && (message === 'link-text' || type === 'sender') ? 'w-fit whitespace-nowrap' : 'self-stretch'} ${type === 'recipient' ? 'text-[#ffffffa3]' : 'text-slate-600'} ${type === 'recipient' && message === 'file-upload' ? 'font-normal' : 'font-medium'}`}
                                                >
                                                    {message === 'file-upload' && type === 'sender' && <>2,5gb • docx</>}
                                                    {message === 'link-text' && <>External link description</>}
                                                    {type === 'recipient' && message === 'file-upload' && (
                                                        <>
                                                            <p><span className="font-medium tracking-[-0.01px]">2,5gb </span></p>
                                                            <p><span className="[font-family:'Plus_Jakarta_Sans-Regular',Helvetica] tracking-[-0.01px]">•&nbsp;&nbsp;docs</span></p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {message === 'link-text' && (
                                            <Link className="!relative !w-6 !h-6" color={type === 'sender' ? '#CBD5E1' : 'white'} />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div
                                className={`relative 
                ${message === 'file-upload' || message === 'image-video' || (message === 'link-image' && type === 'recipient') || message === 'link-text' || message === 'recording' || message === 'reply' ? 'w-full self-stretch' : message === 'link-image' && type === 'sender' ? 'w-[312px]' : ''} 
                ${['text-fill', 'text-hug'].includes(message) ? 'inline-flex' : 'flex'} 
                ${['file-upload', 'image-video', 'reply'].includes(message) ? 'flex-col' : ''} 
                ${['file-upload', 'image-video', 'link-image', 'reply'].includes(message) ? 'items-end' : 'items-center'} 
                ${['file-upload', 'image-video', 'recording'].includes(message) ? 'gap-2.5' : ['link-image', 'link-text'].includes(message) ? 'gap-3' : 'gap-1'} 
                ${['file-upload', 'image-video', 'link-text', 'recording', 'reply'].includes(message) || type === 'recipient' ? 'flex-[0_0_auto]' : ''} 
                ${['file-upload', 'image-video', 'link-image', 'link-text'].includes(message) ? 'p-2' : ''} 
                ${message === 'link-image' && type === 'sender' ? 'h-[62px]' : ''} 
                ${['file-upload', 'image-video', 'reply'].includes(message) ? 'justify-end' : message === 'recording' ? 'justify-center' : ''}`}
                            >
                                {['text-fill', 'text-hug'].includes(message) && time && (
                                    <>
                                        <div
                                            className={`[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] w-fit mt-[-1.00px] tracking-[-0.06px] text-xs font-medium leading-4 whitespace-nowrap relative ${type === 'sender' ? 'text-slate-600' : 'text-indigo-300'}`}
                                        >
                                            {time}
                                        </div>
                                        <CheckCheck
                                            className={message === 'text-hug' && type === 'sender' ? '!relative !w-3 !h-3' : '!relative !w-4 !h-4'}
                                            color={type === 'sender' ? '#475569' : '#A5B4FC'}
                                        />
                                    </>
                                )}
                                {['link-image', 'link-text', 'recording', 'reply'].includes(message) && (
                                    <div
                                        className={`relative 
                    ${message === 'link-image' ? 'flex flex-col grow justify-end gap-1' : ''} 
                    ${message === 'link-text' ? '[display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis' : ''} 
                    ${['link-text', 'recording', 'reply'].includes(message) ? 'mt-[-1.00px]' : ''} 
                    ${['link-text', 'reply'].includes(message) ? `leading-5 [font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[-0.08px]` : message === 'recording' ? `leading-4 [font-family:'Plus_Jakarta_Sans-Bold',Helvetica] font-bold text-xs tracking-[-0.06px]` : ''} 
                    ${['link-text', 'recording'].includes(message) ? 'flex-1' : ''} 
                    ${message === 'reply' ? 'self-stretch' : ''} 
                    ${type === 'recipient' && ['link-text', 'recording', 'reply'].includes(message) ? 'text-white' : type === 'sender' && ['recording', 'reply'].includes(message) ? 'text-slate-800' : message === 'link-text' && type === 'sender' ? 'text-indigo-500' : ''}`}
                                    >
                                        {message === 'reply' && (
                                            <RenderMessageContent text={text} />
                                        )}
                                        {message === 'link-image' && (
                                            <>
                                                <div
                                                    className={`[font-family:'Plus_Jakarta_Sans-Bold',Helvetica] self-stretch mt-[-1.00px] tracking-[-0.11px] text-base relative font-bold leading-[22px] ${type === 'sender' ? 'text-slate-800' : 'text-white'}`}
                                                >
                                                    External Link Title
                                                </div>
                                                <div
                                                    className={`[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] [display:-webkit-box] self-stretch tracking-[-0.08px] [-webkit-line-clamp:1] text-sm relative font-medium overflow-hidden [-webkit-box-orient:vertical] text-ellipsis leading-5 ${type === 'sender' ? 'text-indigo-500' : 'text-white'}`}
                                                >
                                                    https://www.externallink.com
                                                </div>
                                            </>
                                        )}
                                        {message === 'link-text' && <>https://www.externallink.com</>}
                                        {/* {message === 'recording' && <>02:12</>} */}
                                    </div>
                                )}
                                {['file-upload', 'image-video', 'link-image', 'link-text', 'recording', 'reply'].includes(message) && time && (
                                    <div className="inline-flex items-center gap-1 relative">
                                        <div
                                            className={`[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] w-fit mt-[-1.00px] tracking-[-0.06px] text-xs font-medium leading-4 whitespace-nowrap relative ${type === 'sender' ? 'text-slate-600' : 'text-indigo-300'}`}
                                        >
                                            {time}
                                        </div>
                                        <CheckCheck
                                            className="!relative !w-4 !h-4"
                                            color={type === 'sender' ? '#475569' : '#A5B4FC'}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                {message === 'typing' && (
                    <div className="inline-flex flex-col items-center gap-2.5 p-[5px] justify-center relative">
                        <div className="inline-flex items-center gap-2.5 justify-center relative">
                            <div className="inline-flex items-center gap-1 justify-center relative">
                                <div className={`w-2 h-2 rounded relative ${type === 'sender' ? 'bg-slate-600' : 'bg-white'}`} />
                                <div className={`w-2 h-2 rounded relative ${type === 'sender' ? 'bg-slate-600' : 'bg-white'}`} />
                                <div className={`w-2 h-2 rounded relative ${type === 'sender' ? 'bg-slate-600' : 'bg-white'}`} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

ChatBubble.propTypes = {
    isAvatar: PropTypes.bool,
    type: PropTypes.oneOf(['sender', 'recipient']),
    message: PropTypes.oneOf([
        'text-fill',
        'image-video',
        'recording',
        'reply',
        'link-text',
        'link-image',
        'file-upload',
        'text-hug',
        'typing',
    ]),
    text: PropTypes.string,
    time: PropTypes.string,
};