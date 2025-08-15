import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Paper, Divider } from '@mui/material';
import Link from 'next/link';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
  const res = await api.post('/auth/login', { email, password });
  const token = res.data?.data?.token;
  localStorage.setItem('token', token);
  alert('Login successful! Token: ' + token);
  router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minWidth: 350, maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom align="center">Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Divider sx={{ my: 3 }}>or</Divider>
        <Box textAlign="center">
          <Typography variant="body2" sx={{ mb: 1 }}>Don't have an account?</Typography>
          <Link href="/auth/register" passHref>
            <Button variant="outlined" color="secondary" fullWidth>Register</Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
