import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthHandler from "@/hooks/useAuthHandler";
import FormWrapper from "@/components/Auth/FormWrapper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    password: yup
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu là bắt buộc"),
});

export default function LoginForm() {
    const { handleLogin } = useAuthHandler();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        await handleLogin(data, (errorMessage) =>
            setError("root", { type: "manual", message: errorMessage })
        );
    };

    return (
        <FormWrapper
            title="Login to your account"
            subTitle="Enter your email below to login to your account"
            error={errors.root?.message}
            linkText="Don't have an account?"
            linkTo="/register"
            linkLabel="Sign up"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="m@example.com" required />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                        Forgot your password?
                    </a> */}
                </div>
                <Input id="password" type="password" {...register("password")} required />
            </div>
            <Button type="submit" className="w-full">
                Login
            </Button>

            {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                </span>
            </div>
            <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                    />
                </svg>
                Login with GitHub
            </Button> */}

        </FormWrapper>
    )
}


// <FormWrapper
//     title="Welcome back"
//     subTitle="Login to your AI DUT BOT account"
//     error={errors.root?.message}
//     linkText="Don't have an account?"
//     linkTo="/register"
//     linkLabel="Sign up"
//     onSubmit={handleSubmit(onSubmit)}
// ></FormWrapper>

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import useAuthHandler from "@/hooks/useAuthHandler";
// import FormWrapper from "@/components/Auth/FormWrapper";

// const loginSchema = yup.object().shape({
//     email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
//     password: yup
//         .string()
//         .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
//         .required("Mật khẩu là bắt buộc"),
// });

// export default function LoginForm() {
//     const { handleLogin } = useAuthHandler();
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setError,
//     } = useForm({
//         resolver: yupResolver(loginSchema),
//     });

//     const onSubmit = async (data) => {
//         await handleLogin(data, (errorMessage) =>
//             setError("root", { type: "manual", message: errorMessage })
//         );
//     };

//     return (
//         <FormWrapper
//             title="Đăng nhập"
//             // subTitle="AI DUT BOT"
//             error={errors.root?.message}
//             linkText="Chưa có tài khoản?"
//             linkTo="/register"
//             linkLabel="Đăng ký"
//             onSubmit={handleSubmit(onSubmit)}
//         >
//             <div className="gap-2.5 flex flex-col items-start relative self-stretch w-full">
//                 <label className="text-sm sm:text-base font-semibold text-black [font-family:'Inter-SemiBold',Helvetica]" for="email">
//                     Email
//                 </label>
//                 <input
//                     className={`w-full h-12 sm:h-14 px-4 py-3 bg-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.email ? "border border-red-500" : ""}`}
//                     placeholder="Email"
//                     type="email"
//                     {...register("email")}
//                     id="email"
//                     aria-label="Nhập địa chỉ email"
//                 />
//                 {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
//             </div>
//             <div className="gap-2.5 flex flex-col items-start relative self-stretch w-full">
//                 <label className="text-sm sm:text-base font-semibold text-black [font-family:'Inter-SemiBold',Helvetica]" for="password">
//                     Password
//                 </label>
//                 <input
//                     className={`w-full h-12 sm:h-14 px-4 py-3 bg-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${errors.password ? "border border-red-500" : ""}`}
//                     type="password"
//                     placeholder="Password"
//                     {...register("password")}
//                     id="password"
//                     aria-label="Nhập mật khẩu"
//                 />
//                 {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
//             </div>
//             <button
//                 className="w-full h-12 sm:h-14 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:from-indigo-700 active:to-indigo-800 rounded-xl text-white text-sm sm:text-base font-semibold [font-family:'Inter-SemiBold',Helvetica] shadow-md transition-colors duration-200"
//                 type="submit"
//             >
//                 <div
//                     className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-base tracking-[0] leading-[normal] whitespace-nowrap"
//                     aria-label="Đăng nhập vào hệ thống"
//                 >
//                     Đăng nhập
//                 </div>
//             </button>
//         </FormWrapper>
//     );
// }

// ===================================================================================

// import { useState } from "react";
// import useAuthHandler from "../../hooks/useAuth";

// export default function LoginForm() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const { handleLogin } = useAuthHandler();

//     return (
//         <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 shadow-md rounded-xl bg-white text-black">
//             <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
//             <input
//                 className="border p-2 rounded"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//             />
//             <input
//                 className="border p-2 rounded"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//             />
//             {error && <div className="text-red-600 text-sm">{error}</div>}
//             <button
//                 className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//                 onClick={() => handleLogin(email, password, setError)}
//             >
//                 Đăng nhập
//             </button>
//             <p className="text-center text-sm text-gray-600">
//                 Chưa có tài khoản? <a className="text-blue-500 hover:underline" href="/register">Đăng ký</a>
//             </p>
//         </div>
//     );
// }