import PropTypes from "prop-types";

export const Button = ({ className = "", children, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 rounded-xl text-white text-sm font-normal 
                bg-[#6abfe7] transition duration-150 ease-in-out
                hover:bg-[#5ab0d6] active:bg-[#7bc9f0]
                ${className}
            `}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
};

// import PropTypes from "prop-types";
// import React, { useReducer } from "react";

// export const Button = ({ stateProp, className, children }) => {
//     const [state, dispatch] = useReducer(reducer, {
//         state: stateProp || "default",
//     });

//     return (
//         <button
//             className={`all-[unset] box-border inline-flex flex-col items-start gap-2.5 px-2.5 py-1.5 overflow-hidden rounded-xl relative
//         ${state.state === "hover"
//                     ? "[background:linear-gradient(0deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(0deg,rgba(106,191,231,1)_0%,rgba(106,191,231,1)_100%)]"
//                     : state.state === "on-click"
//                         ? "[background:linear-gradient(0deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.1)_100%),linear-gradient(0deg,rgba(106,191,231,1)_0%,rgba(106,191,231,1)_100%)]"
//                         : ""
//                 }
//         ${state.state === "default" ? "bg-[#6abfe7]" : ""}
//         ${className}`}
//             onMouseEnter={() => {
//                 dispatch("mouse_enter");
//             }}
//             onMouseLeave={() => {
//                 dispatch("mouse_leave");
//             }}
//         >
//             <div className="[font-family:'Inter-Regular',Helvetica] w-fit mt-[-2.00px] tracking-[0] text-sm text-white relative font-normal leading-[normal]">
//                 {children}
//             </div>
//         </button>
//     );
// };

// function reducer(state, action) {
//     switch (action) {
//         case "mouse_enter":
//             return {
//                 ...state,
//                 state: "hover",
//             };
//         case "mouse_leave":
//             return {
//                 ...state,
//                 state: "default",
//             };
//         default:
//             return state;
//     }
// }

// Button.propTypes = {
//     stateProp: PropTypes.oneOf(["hover", "on-click", "default"]),
//     className: PropTypes.string,
//     children: PropTypes.node,
// };