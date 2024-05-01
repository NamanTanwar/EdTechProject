import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template";

const Login=()=>{
    return (
        <Template 

         title="Welcome back"
         description1={"Build skills for today, tommorow and beyond"}
         description2={"Education to future-proof your career"}
         image={loginImg}
         formType="login"
        />

        
    )

}

export default Login;