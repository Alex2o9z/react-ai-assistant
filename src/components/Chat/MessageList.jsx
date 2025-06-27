// src/components/Chat/MessageList.jsx
import { useEffect, useRef } from "react";
import { getAudio } from "@/services/speechServices";
import { ChatBubble } from "@/components/Utils/ChatBubble";

export default function MessageList({ messages }) {
    const messagesEndRef = useRef(null);
    const latestAudioRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        const lastMessage = messages[messages.length - 1];
        if (
            lastMessage?.role === "assistant" &&
            (lastMessage.audio || lastMessage.audioTimestamp)
        ) {
            const playAudio = () => {
                try {
                    latestAudioRef.current?.play();
                } catch (err) {
                    console.error("Auto-play failed:", err);
                }
            };

            // Delay a bit to ensure audio is rendered
            setTimeout(playAudio, 300);
        }
    }, [messages]);

    return (
        <div className="flex flex-1 flex-col items-start gap-3 px-4 sm:px-8 md:px-16 lg:px-24 py-4 sm:py-6 md:py-8 relative self-stretch w-full overflow-y-auto">
            {messages.map((m, i) => {
                const isLatest = i === messages.length - 1;
                const shouldAutoPlay = m.role === "assistant" && (m.audio || m.audioTimestamp);
                const audioSrc = m.audio || getAudio(`audio_${m.audioTimestamp}`) || "";
                const type = m.role === "user" ? "recipient" : "sender";
                const message = m.audio || m.audioTimestamp ? "recording" : "text-fill";

                return (
                    <div
                        key={i}
                        className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} justify-center gap-2.5 relative self-stretch w-full`}
                    >
                        <ChatBubble
                            className="!flex-[0_0_auto]"
                            isAvatar={true}
                            avatarSrc={
                                m.role === "user"
                                    ? "/images/user-avatar.svg"
                                    : "/images/app_icon.svg"
                            }
                            message={message}
                            text={m.text}
                            audio={m.audio}
                            audioTimestamp={m.audioTimestamp}
                            latestAudioRef={latestAudioRef}
                            isLatest={isLatest}
                            time=""
                            type={type}
                        />

                        {/* <div className="flex flex-col max-w-[900px] bg-white px-3 py-2.5 rounded-xl shadow text-black">
                            <p className="text-base leading-normal">{m.text}</p>
                            {(m.audio || m.audioTimestamp) && (
                                <audio
                                    ref={shouldAutoPlay && isLatest ? latestAudioRef : null}
                                    controls
                                    src={audioSrc}
                                    className="mt-2 max-w-full"
                                    onError={(e) => {
                                        console.error("Error playing audio for timestamp:", m.audioTimestamp, e);
                                    }}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                        <img
                            className={`w-8 h-8 object-cover ${m.role === "user" ? "" : "order-first"}`}
                            alt="Avatar"
                            src={
                                m.role === "user"
                                    ? "https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
                                    : "https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle-thumbnail.png"
                            }
                        /> */}

                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}