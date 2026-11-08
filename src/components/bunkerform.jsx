import { useForm } from 'react-hook-form'
import './bunkerform.css'


function BunkerForm({formheading, buttonText,showaccess,register, handleSubmit,onSubmit, errors,formpara} ) {

    return (
        <div className='accessform'>
            <h1>{formheading}</h1>
            <p>{formpara}</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div id="form">
                        <input type='password' placeholder='Enter Password' {...register("password")} />
                        {errors.password && (<p>{errors.password.message}</p>)}
                        <Button type="submit" button={buttonText}></Button>
                    </div>
                </form>
            </div>
    )
}

export default BunkerForm