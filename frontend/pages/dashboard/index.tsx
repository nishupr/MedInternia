import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert, Card, Avatar } from '@mui/material';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Redirecting to login.');
      router.push('/auth/login');
      return;
    }
    alert('Using token: ' + token);
    if (!token || token === 'undefined') {
      alert('Token is missing or invalid. Redirecting to login.');
      router.push('/auth/login');
      return;
    }
    api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProfile(res.data.data.user);
        if (res.data.data.user && res.data.data.user._id) {
          localStorage.setItem('userId', res.data.data.user._id);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch profile');
        setLoading(false);
      });
  }, [router]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={profile?.profilePicture} sx={{ width: 64, height: 64 }}>
              {profile?.firstName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>Welcome, {profile?.firstName}!</Typography>
              <Typography variant="body1">Email: {profile?.email}</Typography>
              <Typography variant="body1">User Type: {profile?.userType}</Typography>
              <Typography variant="body2" color="text.secondary">Points: {profile?.points} | Certificates: {profile?.certificatesEarned} | Peer Reviews: {profile?.peerReviewsGiven}</Typography>
            </Box>
          </Box>
          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" color="primary" onClick={() => router.push('/cases')}>View Cases</Button>
            <Button variant="contained" color="secondary" onClick={() => router.push('/certificates')}>My Certificates</Button>
            <Button variant="contained" color="success" onClick={() => router.push('/peer-reviews')}>Peer Reviews</Button>
            <Button variant="outlined" color="primary" onClick={() => router.push('/auth/change-password')}>Change Password</Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
