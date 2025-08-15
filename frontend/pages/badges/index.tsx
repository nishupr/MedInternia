
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../utils/api';
import BadgeCard from '../../components/BadgeCard';

export default function Badges() {
  const [badges, setBadges] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/badges')
      .then(res => {
        setBadges(res.data.data.badges || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch badges');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Badges</Typography>
        {badges.length === 0 ? (
          <Typography>No badges found.</Typography>
        ) : (
          badges.map(b => (
            <BadgeCard key={b._id} badge={b} />
          ))
        )}
      </Box>
    </Container>
  );
}
