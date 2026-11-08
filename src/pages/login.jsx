import { yupResolver } from "@hookform/resolvers/yup"
import Form from "../components/form"
import './login.css'
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { toast } from "sonner";
import { Route, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from "../api"

const loginSchema = yup.object({
    username: yup.string().required("Username required"),
    password: yup.string().required("Password is required")
})

function Loginpage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) })
    const navigate = useNavigate()

    async function handlelogin(data) {

        try {
            const res = await api.post("/auth/login", {
                username: data.username,
                password: data.password
            })

            const result = await res.data

            const message = result.message
            console.log("streaks",result.streaks);
            console.log("points",result.points);
    
            toast.success(message || "login successful")
            sessionStorage.setItem("access_token", result.access_token)
            sessionStorage.setItem("refresh_token", result.refresh_token)
            sessionStorage.setItem("username", result.username)
            sessionStorage.setItem("streaks", result.streaks)
            sessionStorage.setItem("points", result.points)
            console.log(result.username);
            navigate('/Landing')
        } catch (error) {
            const message = error.response?.data?.message || "Unable to log in. Please try again."; 
            toast.error(message); 
            console.error(error);
        }
    }

        return (
            <>
                <div className="outerContainer">
                    <Form formheading="Welcome Back" buttonText="Login"
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={handlelogin}
                        errors={errors}
                    ></Form>
                </div>
            </>
        )
    }

    export default Loginpage