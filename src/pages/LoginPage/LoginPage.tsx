import React, { useState, useEffect } from 'react';
import dog from './assets/Stock-Dog.jpg'
import logo from './assets/fetch_logo.png'
import { fetchAPI } from '../../services/fetchapi'
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, createTheme, Grid2, styled, TextField, ThemeProvider, Typography } from '@mui/material';


const LoginPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setCanSubmit(name !== '' && emailRegex.test(email));
    }, [name, email]);

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await fetchAPI.login(name, email);
            nav('/search');
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const StyledImage = styled('img')({
        width: '60vw',
        height: '100%',
        objectFit: 'cover',
    });

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#cc00cc',
          },
          background: {
            default: '#121212', 
            paper: '#1e1e1e', 
          },
          text: {
            primary: '#ffffff', 
            secondary: '#b3b3b3', 
          },
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                '& label.Mui-focused': {
                  color: '#cc00cc', 
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#b3b3b3',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#cc00cc', 
                  },
                  '& input': {
                    color: '#ffffff', 
                  },
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                color: '#ffffff', 
              },
            },
          },
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Grid2 container direction='row' sx={{ height: '100vh', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <Grid2 size={8} sx={{ display: { xs: 'none', md: 'flex' }, maxWidth: '60vw', height: '100%' }}>
                    <StyledImage src={dog} alt="Dog" />
                </Grid2>
                <Grid2 size={4} sx={{ backgroundColor: '#121212', width: '40vw', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Box sx={{ width: '80%', maxWidth: '400px', p: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img src={logo} alt="Fetch Logo" style={{ width: '100%', maxWidth: '200px', margin: '0 auto 1rem' }} />
                        <Typography variant="h5" color='#ffffff'>
                        Fetch Dog Match
                        </Typography>
                    </Box>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={submitLogin}
                            sx={{ mt: 3, py: 2 }}
                            disabled={!canSubmit || isLoading}
                        >
                        {isLoading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Box>
                </Grid2>
            </Grid2>
        </ThemeProvider>
    );
}

export default LoginPage;