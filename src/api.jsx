
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_URL
});


api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/refresh_token")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken =
            sessionStorage.getItem("refresh_token");

        if (!refreshToken) {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");

            return Promise.reject(error);
        }

        try {
           
            const response = await axios.post(
                `${API_URL}/auth/refresh_token`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                }
            );

            const newAccessToken = response.data.access_token;

            sessionStorage.setItem(
                "access_token",
                newAccessToken
            );

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");

            return Promise.reject(refreshError);
        }
    }
);

export default api;