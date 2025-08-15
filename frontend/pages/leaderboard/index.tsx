
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../utils/api';
import LeaderboardTable from '../../components/LeaderboardTable';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/leaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setLeaders(res.data.data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch leaderboard');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Leaderboard</Typography>
        <LeaderboardTable leaders={leaders} />
      </Box>
    </Container>
  );
}
