import RegisterForm from "@/components/Auth/RegisterForm";
import AuthBanner from "@/components/Auth/AuthBanner";
import { Bot } from "lucide-react";

export default function Register() {
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
                        <RegisterForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <AuthBanner type="register" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
            </div>
        </>
    );
}