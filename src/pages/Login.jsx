import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/Auth/LoginForm";
import AuthBanner from "@/components/Auth/AuthBanner";
import { useAuth } from "@/contexts/AuthContext";
import { Bot } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    return (
        <>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <Bot className="size-4" />
                        </div>
                        {import.meta.env.VITE_APP_NAME}
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm onLogin={login} onNavigate={navigate} />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <AuthBanner type="login" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
            </div>
        </>
    )
}

// export default function Login() {
//     const navigate = useNavigate();
//     const { login } = useAuth();  // Lấy hàm login từ AuthContext

//     return (
//         <>
//             <AuthBanner type="login" />
//             <LoginForm onLogin={login} onNavigate={navigate} />
//         </>
//     );
// }