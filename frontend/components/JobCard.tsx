import { Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function JobCard({ job }: { job: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component={Link} href={`/jobs/${job._id}`}>{job.title}</Typography>
        <Typography variant="body2">{job.description}</Typography>
        <Button variant="outlined" sx={{ mt: 1 }} component={Link} href={`/jobs/${job._id}`}>Apply</Button>
      </CardContent>
    </Card>
  );
}
