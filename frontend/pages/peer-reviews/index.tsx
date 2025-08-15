
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Stack } from '@mui/material';
import api from '../../utils/api';
import PeerReviewCard from '../../components/PeerReviewCard';

export default function PeerReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User ID not found. Please login again.');
      setLoading(false);
      return;
    }
    api.get(`/peer-reviews/user/${userId}/received`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setReviews(res.data.data.reviews || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch peer reviews');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>My Peer Reviews</Typography>
        <Stack spacing={2}>
          {reviews.length === 0 ? (
            <Typography>No peer reviews found.</Typography>
          ) : (
            reviews.map(r => (
              <PeerReviewCard key={r._id} review={r} />
            ))
          )}
        </Stack>
      </Box>
    </Container>
  );
}
