import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import * as yup from "yup";

// Định nghĩa schema validation cho login
const loginSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    password: yup
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu là bắt buộc"),
});

// Định nghĩa schema validation cho register
const registerSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    username: yup
        .string()
        .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
        .required("Tên người dùng là bắt buộc"),
    password: yup
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu là bắt buộc"),
});

export default function useAuthHandler() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const handleLogin = async (data, onError) => {
        try {
            // Validate dữ liệu trước khi gửi API
            await loginSchema.validate(data, { abortEarly: false });
            const response = await loginUser(data.email, data.password);
            login(response.access_token);
            navigate("/chat");
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                // Gộp lỗi validation thành một chuỗi
                const errorMessage = err.errors.join(", ");
                onError(errorMessage);
            } else {
                onError(err.message || "Đăng nhập thất bại");
            }
        }
    };

    const handleRegister = async (data, onError) => {
        try {
            // Validate dữ liệu trước khi gửi API
            await registerSchema.validate(data, { abortEarly: false });
            await registerUser(data);
            navigate("/login");
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errorMessage = err.errors.join(", ");
                onError(errorMessage);
            } else {
                console.error(err);
                onError(err.message || "Đăng ký thất bại");
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return { handleLogin, handleRegister, handleLogout };
}