import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await api.post('/auth/change-password', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Change Password</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Change Password
          </Button>
        </form>
      </Box>
    </Container>
  );
}
