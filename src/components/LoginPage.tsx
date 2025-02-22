import React, { useState } from 'react';

const LoginPage: React.FC = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    return (
        <div>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button>Login</button>
        </div>
    )
}

export default LoginPage;