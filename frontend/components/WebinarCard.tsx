import { Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function WebinarCard({ webinar }: { webinar: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component={Link} href={`/webinars/${webinar._id}`}>{webinar.title}</Typography>
        <Typography variant="body2">{webinar.description}</Typography>
        <Button variant="outlined" sx={{ mt: 1 }} component={Link} href={`/webinars/${webinar._id}`}>Register</Button>
      </CardContent>
    </Card>
  );
}
