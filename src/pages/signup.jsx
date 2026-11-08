import Form from "../components/form"
import './signup.css'
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import NavbarLand from "../components/navbarland"
import { useState } from "react"
import Loginpage from "./login"
import Explore from "./explore"

const signupSchema = yup.object(
    {
        email: yup.string().email("Enter a valid email").required("email is required"),
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters")
            .matches(/[A-Za-z]/, "Password must contain atleast one letter")
            .matches(/[0-9]/, "Password must contain atleast one number")
            .matches(/[@#$%^&*(),.?":{}|<>]/, "Password must conain one special charecter ")
    }
)
function Signuppage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(signupSchema) })
    const [activetab, setActive] = useState("signup")
    async function handlesignup(data) {

        const email = data.email
        const username = data.username
        const password = data.password
        try {
            const res = await fetch("http://127.0.0.1:8000/auth/signup", {
                method: 'POST',
                headers: { 'Content-Type': 'Application/json' },
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                    "email": email
                })
            })
            const result = await res.json()
            const message = result.message

            if (res.ok) {
                toast.success(message)
            }
            else {
                toast.error(message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="outercontainer">
                <Form formheading="Signup"
                buttonText="Signup"
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={handlesignup}
                errors={errors}
                showEmail={true}
                ></Form>
            </div>


        </>
    )
}

export default Signuppage