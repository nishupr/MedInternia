import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent, Button } from '@mui/material';
import api from '../../utils/api';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/jobs/${id}`)
      .then(res => {
        setJob(res.data.data.job);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch job');
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Applied successfully!');
    } catch {
      setError('Failed to apply');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!job) return null;

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>{job.title}</Typography>
            <Typography variant="body1">{job.description}</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleApply}>Apply</Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
