import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import dog from './assets/Stock-Dog.jpg'
import logo from './assets/fetch_logo.png'
import { fetchAPI } from '../../services/fetchapi'
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'
import { Box, Button, CircularProgress, Grid2, styled, TextField, Typography } from '@mui/material';


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
      toast.error('Login failed. Please try again.');
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

  return (
    <Grid2 container direction='row' sx={{ height: '100vh' }}>
      <Grid2 sx={{ xs: 12, md: 6, display: { xs: 'none', md: 'flex' } }}>
        <StyledImage src={dog} alt="Dog" />
      </Grid2>
      <Grid2 sx={{ xs: 12, md: 6, width: '40vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '80%', maxWidth: '400px', p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src={logo} alt="Fetch Logo" style={{ width: '100%', maxWidth: '200px', margin: '0 auto 1rem' }} />
            <Typography variant="h5" component="h1">
              Fetch Dog Search
            </Typography>
          </Box>
          <form onSubmit={submitLogin}>
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
              sx={{ mt: 3, py: 2 }}
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
          <Toaster />
        </Box>
      </Grid2>
    </Grid2>
  );
}

export default LoginPage;