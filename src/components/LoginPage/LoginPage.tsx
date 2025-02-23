import React, { useState } from 'react';
import dog from './assets/Stock-Dog.jpg'
import logo from './assets/fetch_logo.png'
import './LoginPage.css'

const LoginPage: React.FC = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    return (
        <div className='login-main-container'>
            <div className='login-left'>
                <img src={dog} /> 
            </div>
            <div className='login-right'>
                <div className='login-right-container'>
                    <div className='login-logo-container'>
                        <img src={logo} alt='Fetch Logo'/>
                        <h1>Fetch Dog Search</h1>
                    </div>
                    <form>
                        <div className='label-input'>
                            <label>Name</label>
                            <input type="text" placeholder="FirstName LastName" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className='label-input'>
                            <label>Email</label>
                            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;