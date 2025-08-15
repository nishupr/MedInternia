
import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import api from '../../utils/api';
import Link from 'next/link';
import CaseCard from '../../components/CaseCard';

export default function Cases() {
  const [cases, setCases] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/cases', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCases(res.data.data.cases || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch cases');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Medical Cases</Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} component={Link} href="/cases/create">
          Create New Case
        </Button>
        {cases.length === 0 ? (
          <Typography>No cases found.</Typography>
        ) : (
          cases.map(c => (
            <CaseCard key={c._id} caseData={c} />
          ))
        )}
      </Box>
    </Container>
  );
}
