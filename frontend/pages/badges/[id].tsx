import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import api from '../../utils/api';

export default function BadgeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [badge, setBadge] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/badges/${id}`)
      .then(res => {
        setBadge(res.data.data.badge);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch badge');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!badge) return null;

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>{badge.name}</Typography>
            <Typography variant="body1">{badge.description}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
