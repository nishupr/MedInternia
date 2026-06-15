import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent, Button, Chip } from '@mui/material';
import api from '../../utils/api';

const getWebinarEndTime = (webinar: any) => {
  const duration = Number(webinar.duration || 0);
  return new Date(new Date(webinar.scheduledAt).getTime() + duration * 60 * 1000);
};

const isWebinarExpired = (webinar: any) => {
  const now = new Date();

  if (webinar.status === 'completed' || webinar.status === 'cancelled') {
    return true;
  }

  if (webinar.status === 'live') {
    return getWebinarEndTime(webinar) <= now;
  }

  return new Date(webinar.scheduledAt) <= now;
};

export default function WebinarDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [webinar, setWebinar] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/webinars/${id}`)
      .then(res => {
        setWebinar(res.data.data.webinar);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch webinar');
        setLoading(false);
      });
  }, [id]);

  const handleRegister = async () => {
    if (!webinar || isWebinarExpired(webinar) || webinar.status !== 'scheduled') {
      setError('This webinar has completed and registration is closed.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post(`/webinars/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registered successfully!');
    } catch {
      setError('Failed to register');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!webinar) return null;

  const expired = isWebinarExpired(webinar);
  const statusLabel = expired ? (webinar.status === 'cancelled' ? 'Cancelled' : 'Completed') : webinar.status;
  const registrationClosed = expired || webinar.status !== 'scheduled';

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="h4">{webinar.title}</Typography>
              <Chip
                label={statusLabel}
                color={expired ? 'default' : webinar.status === 'live' ? 'success' : 'primary'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {new Date(webinar.scheduledAt).toLocaleString()}
            </Typography>
            <Typography variant="body1">{webinar.description}</Typography>
            {expired && (
              <Alert severity="info" sx={{ mt: 2 }}>
                This webinar has completed. Joining and registration are no longer available.
              </Alert>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleRegister}
              disabled={registrationClosed}
            >
              {registrationClosed ? 'Registration closed' : 'Register'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
