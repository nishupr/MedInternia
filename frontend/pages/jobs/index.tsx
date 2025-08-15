
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../utils/api';
import JobCard from '../../components/JobCard';

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs')
      .then(res => {
        setJobs(res.data.data.jobs || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch jobs');
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Job Opportunities</Typography>
        {jobs.length === 0 ? (
          <Typography>No jobs found.</Typography>
        ) : (
          jobs.map(j => (
            <JobCard key={j._id} job={j} />
          ))
        )}
      </Box>
    </Container>
  );
}
