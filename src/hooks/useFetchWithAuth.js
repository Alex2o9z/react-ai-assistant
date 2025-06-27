import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useFetchWithAuth = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const fetchWithAuth = async (url, options = {}) => {
        if (!token) {
            console.error("No token available");
            logout();
            setTimeout(() => navigate("/login"), 0);
            return null;
        }

        const isFormData = options.body instanceof FormData;

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
        };

        console.log("Sending request with headers:", headers);
        console.log("Request URL:", url);

        const res = await fetch(url, { ...options, headers });

        if (res.status === 401 || res.status === 403) {
            const errorMessage = await res.text();
            console.error(`${res.status === 401 ? "Unauthorized" : "Forbidden"}:`, errorMessage);
            logout();
            setTimeout(() => navigate("/login"), 0);
            return null;
        }

        return res;
    };

    return fetchWithAuth;
};


// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// export const useFetchWithAuth = () => {
//     const { token, logout } = useAuth();
//     const navigate = useNavigate();

//     const fetchWithAuth = async (url, options = {}) => {
//         if (!token) {
//             console.error("No token available");
//             logout();
//             setTimeout(() => navigate("/login"), 0); // Trì hoãn navigate
//             return null;
//         }

//         const headers = {
//             ...options.headers,
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//         };

//         console.log("Sending request with headers:", headers); // Debug headers
//         console.log("Request URL:", url); // Debug URL

//         const res = await fetch(url, { ...options, headers });

//         if (res.status === 401) {
//             console.log("Token:", token);
//             const errorMessage = await res.text();
//             console.error("Unauthorized error from server:", errorMessage);
//             logout();
//             setTimeout(() => navigate("/login"), 0); // Trì hoãn navigate
//             return null;
//         }

//         if (res.status === 403) {
//             console.log("Token:", token);
//             const errorMessage = await res.text();
//             console.error("Forbidden error from server:", errorMessage);
//             logout();
//             setTimeout(() => navigate("/login"), 0); // Handle 403
//             return null;
//         }

//         return res;
//     };

//     return fetchWithAuth;
// };

// ================================================================================

// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// export const useFetchWithAuth = () => {
//     const { token, logout } = useAuth();
//     const navigate = useNavigate();

//     const fetchWithAuth = async (url, options = {}) => {
//         const headers = {
//             ...options.headers,
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//         };

//         console.log("Sending request with headers:", headers);

//         const res = await fetch(url, { ...options, headers });

//         if (res.status === 401) {
//             console.log("Token:", token);  // Kiểm tra token
//             const errorMessage = await res.text();
//             console.error("Lỗi từ server: ", errorMessage);
//             logout();
//             navigate("/login");
//             return null;
//         }

//         return res;
//     };

//     return fetchWithAuth;
// };