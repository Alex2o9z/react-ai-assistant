import ChatPage from "@/components/Chat/ChatPage";
import { useAuth } from "@/contexts/AuthContext";

export default function Chat() {
    const { token } = useAuth();
    return <ChatPage token={token} />;
}