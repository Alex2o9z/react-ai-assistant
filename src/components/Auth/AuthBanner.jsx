import { UserCheck, UserRoundPlus, HandHelping, BotMessageSquare, Cpu, BrainCircuit, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthBanner({ type, className }) {

    return (
        <div className={className}>
            <div className={cn("relative w-full h-full bg-gradient-to-b from-blue-700 to-blue-900 overflow-hidden")}>
                <div className="relative w-full h-[50vh] md:h-screen">
                    {/* Gradient Circles */}
                    <div className="absolute aspect-square w-[100%] top-70 md:top-[50%] left-[30%] rounded-full bg-gradient-to-br from-white/1 to-transparent" />
                    <div className="absolute aspect-square w-[120%] top-50 md:top-[30%] left-[5%] rounded-full bg-gradient-to-br from-white/3 to-transparent" />
                    <div className="absolute aspect-square w-[120%] top-20 md:top-[10%] -left-[10%] md:-left-[10%] rounded-full bg-gradient-to-br from-white/2 to-transparent" />
                    <div className="absolute aspect-square w-[140%] -top-20 md:-top-[10%] -left-[25%] rounded-full bg-gradient-to-br from-white/3 to-transparent" />

                    {/* Icons and Decorative Elements */}
                    <div className="absolute inset-0 h-3/4">
                        <div className="absolute aspect-square w-[30%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent">
                            {/* UserCheck Icon */}
                            <div className="absolute w-[60%] h-[60%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                {type === "login" && (
                                    <UserCheck className="w-full h-full" color="#FFFFFF" />
                                )}
                                {type === "register" && (
                                    <UserRoundPlus className="w-full h-full" color="#FFFFFF" />
                                )}
                            </div>
                        </div>

                        <div className="absolute aspect-square w-[8%] left-1/7 top-1/3 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent">
                            <div className="absolute w-[60%] h-[60%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <HandHelping className="w-full h-full" color="#FFFFFF" />
                            </div>
                        </div>

                        <div className="absolute aspect-square w-[10%] left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent">
                            <div className="absolute w-[60%] h-[60%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <BotMessageSquare className="w-full h-full" color="#FFFFFF" />
                            </div>
                        </div>

                        <div className="absolute aspect-square w-[6%] left-1/8 bottom-1/3 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent">
                            <div className="absolute w-[60%] h-[60%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Cpu className="w-full h-full" color="#FFFFFF" />
                            </div>
                        </div>

                        <div className="absolute aspect-square w-[12%] right-1/9 top-4/9 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent">
                            <div className="absolute w-[60%] h-[60%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <BrainCircuit className="w-full h-full" color="#FFFFFF" />
                            </div>
                        </div>

                        <div className="absolute aspect-square w-[6%] right-1/6 top-2/3 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent">
                            <div className="absolute w-[60%] h-[60%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Lightbulb className="w-full h-full" color="#FFFFFF" />
                            </div>
                        </div>

                        <div className="absolute aspect-square w-[4%] left-0 top-5/11 transform -translate-x-1/2 -translate-y-1/2rounded-lg blur-xs rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent" />
                        <div className="absolute aspect-square w-[3%] left-7/10 top-1/4 transform -translate-x-1/2 -translate-y-1/2rounded-lg blur-xs rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent" />
                        <div className="absolute aspect-square w-[6%] -right-10 top-2/7 transform -translate-x-1/2 -translate-y-1/2rounded-lg blur-xs rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent" />
                        <div className="absolute aspect-square w-[3%] -right-5 top-3/7 transform -translate-x-1/2 -translate-y-1/2rounded-lg blur-xs rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent" />
                        <div className="absolute aspect-square w-[4%] right-10 top-4/7 transform -translate-x-1/2 -translate-y-1/2rounded-lg blur-xs rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent" />
                        <div className="absolute aspect-square w-[3%] -right-5 top-5/7 transform -translate-x-1/2 -translate-y-1/2rounded-lg blur-xs rounded-2xl bg-gradient-to-b from-blue-500/40 to-transparent" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-end gap-6 px-4 sm:px-6 md:px-12 xl:px-24 py-8 sm:py-10 xl:py-30">
                        <div className="text-xs sm:text-sm md:text-lg xl:text-xl text-white/60 font-semibold tracking-widest">
                            aidutassistant.com
                        </div>
                        <p className="text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl text-white text-justify max-w-full font-bold leading-relaxed">
                            {/* AI DUT Assistant là trợ lý ảo thông minh được phát triển nhằm hỗ trợ sinh viên và giảng viên Trường Đại học Bách Khoa – Đại học Đà Nẵng trong việc tra cứu thông tin, giải đáp thắc mắc và nâng cao hiệu quả học tập, giảng dạy. */}
                            AI DUT Assistant is an intelligent virtual assistant designed to support students and lecturers at the University of Science and Technology – The University of Danang in accessing information, answering questions, and enhancing the effectiveness of learning and teaching.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// import { UserCheck } from "lucide-react";

// export default function AuthBanner({ }) {
//     const image1 = "https://static-00.iconduck.com/assets.00/image-icon-2048x1707-k48ceayq.png";
//     const vector = "https://www.svgrepo.com/show/532036/cloud-rain-alt.svg";
//     return (
//         <div className="relative w-[720px] h-[900px] overflow-hidden [background:linear-gradient(180deg,rgba(55,48,163,1)_0%,rgba(49,46,129,1)_100%)]">
//             <div className="relative w-[1258px] h-[1258px] top-[-73px] left-[-249px]">
//                 <div className="absolute w-[935px] h-[935px] top-[323px] left-[323px] rounded-[467.5px] [background:linear-gradient(164deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0)_100%)]" />

//                 <div className="absolute w-[935px] h-[935px] top-[139px] left-[115px] rounded-[467.5px] [background:linear-gradient(140deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_100%)]" />

//                 <div className="absolute w-[1090px] h-[1090px] top-0 left-0 rounded-[545px] [background:linear-gradient(140deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)]" />

//                 <div className="absolute w-[700px] h-[700px] top-[507px] left-[531px] rounded-[350px] [background:linear-gradient(140deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0)_100%)]" />

//                 <div className="absolute w-[782px] h-[317px] top-[253px] left-[219px]">
//                     <div className="absolute w-[83px] h-[83px] top-[116px] left-[133px] rounded-[18px]">
//                         <div className="relative w-[55px] h-[50px] top-[17px] left-3.5 bg-[url(/group.png)] bg-[100%_100%]" />
//                     </div>

//                     <div className="absolute w-[50px] h-[50px] top-[231px] left-[72px] rounded-[18px]">
//                         <div className="relative w-[27px] h-[31px] top-2.5 left-3 bg-[url(/image.png)] bg-[100%_100%]" />
//                     </div>

//                     <div className="absolute w-[62px] h-[62px] top-[22px] left-[87px] rounded-[18px]">
//                         <img
//                             className="absolute w-[30px] h-[37px] top-[13px] left-4"
//                             alt="Vector"
//                             src={vector}
//                         />
//                     </div>

//                     <div className="absolute w-11 h-11 top-[126px] left-0 rounded-[18px] blur-sm [background:linear-gradient(180deg,rgba(107,99,235,0.4)_0%,rgba(79,70,229,0)_100%)]" />

//                     <div className="absolute w-[65px] h-[65px] top-[7px] left-[717px] rounded-[18px] [background:linear-gradient(180deg,rgba(79,70,229,0.4)_0%,rgba(79,70,229,0)_100%)]" />

//                     <div className="absolute w-[46px] h-[46px] top-52 left-[693px] rounded-[18px] blur-sm [background:linear-gradient(180deg,rgba(107,99,235,0.4)_0%,rgba(79,70,229,0)_100%)]" />

//                     <div className="absolute w-[37px] h-[37px] top-[280px] left-[736px] rounded-[18px] blur-sm [background:linear-gradient(180deg,rgba(107,99,235,0.4)_0%,rgba(79,70,229,0)_100%)]" />

//                     <div className="absolute w-7 h-7 top-0 left-[548px] rounded-[18px] blur-sm [background:linear-gradient(180deg,rgba(107,99,235,0.4)_0%,rgba(79,70,229,0)_100%)]" />

//                     <div className="absolute w-[22px] h-[22px] top-[129px] left-[735px] rounded-[18px] blur-sm [background:linear-gradient(180deg,rgba(107,99,235,0.4)_0%,rgba(79,70,229,0)_100%)]" />

//                     <div className="absolute w-[49px] h-[49px] top-[241px] left-[583px] rounded-[18px]">
//                         <img
//                             className="absolute w-[29px] h-[29px] top-[11px] left-[11px]"
//                             alt="Vector"
//                             src={image1}
//                         />
//                     </div>

//                     <div className="absolute w-[114px] h-[114px] top-[79px] left-[562px] rounded-[18px]">
//                         <div className="relative w-[71px] h-[43px] top-9 left-[21px] bg-[url(/group-2.png)] bg-[100%_100%]" />
//                     </div>

//                     <div className="absolute w-[242px] h-[242px] top-[37px] left-[267px] rounded-2xl [background:linear-gradient(180deg,rgba(79,70,229,0.4)_0%,rgba(79,70,229,0)_100%)]" />
//                 </div>

//                 <p className="absolute w-[537px] top-[674px] left-[350px] [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[42px]">
//                     Ayo mendaftar dan belajar dengan rajin di sini supaya jadi pinter
//                     dan nggak jadi beban kayak si Denis!
//                 </p>

//                 <div className="absolute top-[636px] left-[350px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#ffffff99] text-sm tracking-[2.10px] leading-7 whitespace-nowrap">
//                     NAMANYAJUGABELAJAR.IO
//                 </div>

//                 <div className="absolute w-32 h-32 top-[347px] left-[545px]">
//                     <UserCheck className="w-32 h-32" color="#FFFFFF" />
//                 </div>
//             </div>
//         </div>
//     );
// }