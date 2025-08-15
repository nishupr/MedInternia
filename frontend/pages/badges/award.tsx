import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import api from '../../utils/api';

export default function AwardBadge() {
  const [userId, setUserId] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await api.post('/badges/award', { userId, badgeId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Badge awarded successfully!');
      setUserId('');
      setBadgeId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to award badge');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Award Badge</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="User ID" value={userId} onChange={e => setUserId(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Badge ID" value={badgeId} onChange={e => setBadgeId(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Award Badge
          </Button>
        </form>
      </Box>
    </Container>
  );
}
