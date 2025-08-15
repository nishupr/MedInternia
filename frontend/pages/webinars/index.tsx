
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Stack } from '@mui/material';
import api from '../../utils/api';
import WebinarCard from '../../components/WebinarCard';

export default function Webinars() {
  const [webinars, setWebinars] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/webinars')
      .then(res => {
        setWebinars(res.data.data.webinars || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch webinars');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Webinars & AMAs</Typography>
        <Stack spacing={2}>
          {webinars.length === 0 ? (
            <Typography>No webinars found.</Typography>
          ) : (
            webinars.map(w => (
              <WebinarCard key={w._id} webinar={w} />
            ))
          )}
        </Stack>
      </Box>
    </Container>
  );
}
