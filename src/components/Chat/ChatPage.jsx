import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";
import FileList from "@/components/Chat/FileList";
import ErrorAlert from "@/components/Chat/ErrorAlert";
import useChatLogic from "@/hooks/useChatLogic";

export default function ChatPage({ token }) {
    const {
        input,
        setInput,
        messages,
        files,
        error,
        setError,
        sendMessage,
        sessionId,
        handleUpload,
        uploadLoading,
        deleteFile,
        isFetching,
        fetchFiles,
        audioAction,
    } = useChatLogic(token);
    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="bg-background relative flex flex-1 flex-col w-full min-w-0">
                <MessageList messages={messages} />

                <MessageInput
                    stateProp="default"
                    input={input}
                    setInput={setInput}
                    onSend={sendMessage}
                    handleUpload={handleUpload}
                    uploadLoading={uploadLoading}
                    fetchFiles={fetchFiles}
                />
            </div>

            {sessionId && (
                <FileList
                    sessionId={sessionId}
                    files={files}
                    deleteFile={deleteFile}
                    audioAction={audioAction}
                    isFetching={isFetching}
                />
            )}

            <div className="flex w-full items-center justify-center gap-2.5 absolute left-0">
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
            </div>
        </div>
    );
}