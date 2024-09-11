import '../styles/LoginPage.scss'
import { useState } from 'react'
import { emailInput, passwordInput } from './classes/PolymorphicEmailInput'





const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // const localDevelopmentURL = "http://localhost:8080/api/auth/signin";
    const productionURL = 'http://18.191.173.196:8080/api/auth/signin';
   
    return (
        <>
            <div className='body'>
                
                <form>
                    <h3>Welcome Back!</h3>

                    <label>Email</label>
                    <input 
                        id="email" 
                        value={email} 
                        placeholder="someone@example.com"
                        onChange={(e) => setEmail(e.target.value)}/>  

                    <label>Username</label>
                    <input 
                        id="username" 
                        value={username} 
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}/> 

                    <label>Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}/> 

                    <button
                    onClick={() => {

                        
                        let emailInputBox = new emailInput(email)
                        let passwordInputBox = new passwordInput(password)
                        
                        
                        if (emailInputBox.verify() == true) {
                            if (passwordInputBox.verify() == true) {
                                
                                fetch(productionURL, {
                                    method: "POST",
                                    headers: { 
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*' 
                                    },
                                    body: JSON.stringify({
                                        email: email,
                                        username: username,
                                        password: password 
                                    })
                                }).then((response) => response.json())
                                .then((data) => {
                                    console.log(data)
                                    if (data.new_window == "false") {
                                        // display(data.text)
                                        // TODO
                                        // display error messages on the homescreens
                                        alert(data.message)

                                    } else if (data.new_window == "true") {
                                        window.open('/homepage','_self', );
                                        localStorage.setItem('username', data.username)

                                    }
                                }) 
                            }
                        }
                    }}
                    type='button'
                    >Log In</button>

                    <div className='login-redirect'>
                        <a href="/signup">Don't Have An Account?</a>
                    </div>
                    
                </form>
            </div>
           
        </>
    )
}

export default LoginPage


