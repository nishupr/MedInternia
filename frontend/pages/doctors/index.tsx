import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../utils/api';
import DoctorCard from '../../components/DoctorCard';

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/doctors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setDoctors(res.data.data.doctors || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch doctors');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Doctors</Typography>
        {doctors.length === 0 ? (
          <Typography>No doctors found.</Typography>
        ) : (
          doctors.map(d => (
            <DoctorCard key={d._id} doctor={d} />
          ))
        )}
      </Box>
    </Container>
  );
}
