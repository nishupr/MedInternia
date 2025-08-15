import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function CreateCase() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await api.post('/cases', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Case created successfully!');
      setForm({ title: '', description: '' });
      setTimeout(() => router.push('/cases'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create case');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Create Medical Case</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Title" name="title" fullWidth margin="normal" value={form.title} onChange={handleChange} required />
          <TextField label="Description" name="description" fullWidth margin="normal" value={form.description} onChange={handleChange} required multiline rows={4} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Create Case
          </Button>
        </form>
      </Box>
    </Container>
  );
}
