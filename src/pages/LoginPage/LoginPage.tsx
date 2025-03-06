import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import dog from './assets/Stock-Dog.jpg'
import logo from './assets/fetch_logo.png'
import { fetchAPI } from '../../services/fetchapi'
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'

const LoginPage: React.FC = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [canSubmit, setCanSubmit] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setCanSubmit((name !== '') && emailRegex.test(email))
    }, [name, email]);

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await fetchAPI.login(name, email);
            nav('/search');
        } catch (err: any) { 
            toast('There was an issue please try again');
            console.log(err.message);
        }
    }

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
                    <form onSubmit={submitLogin}>
                        <div className='label-input'>
                            <label>Name</label>
                            <input type="text" placeholder="FirstName LastName" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className='label-input'>
                            <label>Email</label>
                            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" disabled={!canSubmit}>Login</button>
                    </form>
                    <Toaster />
                </div>
            </div>
        </div>
    )
}

export default LoginPage;