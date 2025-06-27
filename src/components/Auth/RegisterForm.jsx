import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthHandler from "@/hooks/useAuthHandler";
import FormWrapper from "@/components/Auth/FormWrapper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const registerSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    username: yup
        .string()
        .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
        .required("Tên người dùng là bắt buộc"),
    password: yup
        .string()
        .matches(
            passwordRegex,
            "Mật khẩu phải có ít nhất 6 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
        )
        .required("Mật khẩu là bắt buộc"),
});

export default function RegisterForm() {
    const { handleRegister } = useAuthHandler();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        await handleRegister(data, (errorMessage) =>
            setError("root", { type: "manual", message: errorMessage })
        );
    };

    return (
        <FormWrapper
            title="Create your account"
            subTitle="Enter your email below to create your account"
            error={errors.root?.message}
            linkText="Already have an account?"
            linkTo="/login"
            linkLabel="Log in"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="m@example.com" required />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-3">
                <Label htmlFor="username">Account name</Label>
                <Input id="username" type="username" {...register("username")} placeholder="John Doe" required />
                {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
            </div>
            <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} required />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">
                Sign up
            </Button>

            {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or sign up with
                </span>
            </div>
            <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                    />
                </svg>
                Sign up with GitHub
            </Button> */}

            {/* <div className="gap-2.5 flex flex-col items-start relative self-stretch w-full">
                <label className="text-sm sm:text-base font-semibold text-black [font-family:'Inter-SemiBold',Helvetica]" for="email">
                    Email
                </label>
                <input
                    className={`w-full h-12 sm:h-14 px-4 py-3 bg-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="Email"
                    type="email"
                    {...register("email")}
                    id="email"
                    aria-label="Nhập địa chỉ email"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            <div className="gap-2.5 flex flex-col items-start relative self-stretch w-full">
                <label className="text-sm sm:text-base font-semibold text-black [font-family:'Inter-SemiBold',Helvetica]" for="username">
                    User Name
                </label>
                <input
                    className={`w-full h-12 sm:h-14 px-4 py-3 bg-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.username ? "border-red-500" : ""}`}
                    placeholder="Username"
                    type="text"
                    {...register("username")}
                    id="username"
                    aria-label="Nhập tên người dùng"
                />
                {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
            </div>
            <div className="gap-2.5 flex flex-col items-start relative self-stretch w-full">
                <label className="text-sm sm:text-base font-semibold text-black [font-family:'Inter-SemiBold',Helvetica]" for="password">
                    Password
                </label>
                <input
                    className={`w-full h-12 sm:h-14 px-4 py-3 bg-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.password ? "border-red-500" : ""}`}
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    id="password"
                    aria-label="Nhập mật khẩu"
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>
            <button
                className="w-full h-12 sm:h-14 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:from-indigo-700 active:to-indigo-800 rounded-xl text-white text-sm sm:text-base font-semibold [font-family:'Inter-SemiBold',Helvetica] shadow-md transition-colors duration-200"
                type="submit"
            >
                <div
                    className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal] whitespace-nowrap"
                    aria-label="Đăng ký tài khoản vào hệ thống"
                >
                    Đăng ký
                </div>
            </button> */}
        </FormWrapper>
    );
}