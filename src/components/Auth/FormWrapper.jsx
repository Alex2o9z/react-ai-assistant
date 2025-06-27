import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function FormWrapper({ title, subTitle, error, children, linkText, linkTo, linkLabel, onSubmit, className, ...props }) {
    return (
        <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    {subTitle}
                </p>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="grid gap-6">
                {children}
            </div>

            <div className="text-center text-sm">
                {linkText}{" "}
                <Link className="underline underline-offset-4" to={linkTo}>
                    {linkLabel}
                </Link>
            </div>
        </form>
    );
}

// import { Link } from "react-router-dom";

// export default function FormWrapper({ title, subTitle, error, children, linkText, linkTo, linkLabel, onSubmit }) {
//     return (
//         <form
//             onSubmit={onSubmit}
//             // className="flex flex-col w-full md:w-1/2 items-center md:justify-center gap-4 px-4 sm:px-8 md:px-16 lg:px-[140px] py-6 sm:py-10 md:py-[90px]"
//             className="flex flex-col w-full max-w-md mx-auto items-center justify-center gap-6 px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 md:py-16 min-h-screen"
//         >
//             {/* <h2 className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-black text-[32px] tracking-[0] leading-[normal]">{title}</h2> */}
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black [font-family:'Inter-SemiBold',Helvetica]">
//                 {title}
//             </h2>
//             {/* <p className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-gray-600 text-base tracking-[0] leading-7">{subTitle}</p> */}
//             <p className="text-sm sm:text-base text-gray-600 text-center [font-family:'Inter-Regular',Helvetica] leading-relaxed max-w-md">
//                 {subTitle}
//             </p>

//             <div className="flex flex-col items-start gap-6 w-full">
//                 {children}
//             </div>

//             {error && <div className="text-red-600 text-sm">{error}</div>}

//             <p className="text-sm sm:text-base text-center [font-family:'Inter-SemiBold',Helvetica]">
//                 <span className="text-gray-600">{linkText}{" "}</span>
//                 <Link className="text-indigo-600 hover:underline" to={linkTo}>
//                     {linkLabel}
//                 </Link>
//             </p>
//         </form>
//     );
// }