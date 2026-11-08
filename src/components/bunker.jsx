import { useState } from 'react'
import './bunker.css'
import * as yup from "yup"
import BunkerForm from './bunkerform'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const Bunkerschema = yup.object({
    password : yup.string().required("Password is required")
})
function Bunker() {
    const {register,handleSubmit,formState:{errors}} = useForm({resolver:yupResolver(Bunkerschema)})
    const [access,setAccess] = useState("create")

    async function handlesaccess() {
        console.log("this is access");
    }

    return(
        <>
        <div className="bunkerentrance">
            <div id='access'>
                <div id='accesstype'>
                    <p onClick={()=>setAccess("create")}>Create</p>
                    <p onClick={()=>setAccess("access")}>Access</p>
                </div>
            </div>
            <div id="content">
                
                {
                    access === 'create' && (
                       <BunkerForm
                        formheading = "Create Your Bunker"
                        formpara = "A private space to keep the moments, thoughts, and memories you want to hold onto."
                        buttonText = "Create"
                        register ={register}
                        handleSubmit ={handleSubmit}
                        onSubmit ={handlesaccess}
                        errors = {errors}
                        ></BunkerForm>
                    )
                }

                {
                    access === 'access' && (
                        <BunkerForm
                        formheading = "Unlock Your Bunker"
                        formpara = "Some memories are meant to stay close."
                        buttonText = "Access"
                        register ={register}
                        handleSubmit ={handleSubmit}
                        onSubmit ={handlesaccess}
                        errors = {errors}
                        ></BunkerForm>
                    )
                }
            </div>
        </div>
        </>
        
    )
}

export default Bunker