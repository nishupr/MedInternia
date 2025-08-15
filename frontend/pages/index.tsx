import { Container, Typography, Box, Button, Paper, Divider, Stack } from '@mui/material';
// import Link from 'next/link';
import Link from 'next/link';

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight={700}>
            Med-Internia Healthcare Platform
          </Typography>
          <Typography variant="h6" gutterBottom align="center">
            Welcome! Please login or register to continue.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            <Typography variant="body1" align="center">
              Med-Internia is a comprehensive medical education and collaboration platform connecting doctors, interns, and patients. Features include:
            </Typography>
            <ul style={{ fontSize: '1.1rem', marginLeft: '2rem' }}>
              <li>Case-based learning and analysis</li>
              <li>Peer review and feedback system</li>
              <li>Badges and certification achievements</li>
              <li>Job opportunities board</li>
              <li>Webinars and live AMAs</li>
              <li>AI-powered suggestions</li>
              <li>Leaderboard and advanced search</li>
              <li>LinkedIn/GitHub export, video conferencing</li>
            </ul>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Link href="/auth/login" passHref>
                <Button variant="contained" color="primary" sx={{ minWidth: 120 }}>
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button variant="outlined" color="secondary" sx={{ minWidth: 120 }}>
                  Register
                </Button>
              </Link>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
