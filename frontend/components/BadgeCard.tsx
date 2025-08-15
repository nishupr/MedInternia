import { Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

export default function BadgeCard({ badge }: { badge: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component={Link} href={`/badges/${badge._id}`}>{badge.name}</Typography>
        <Typography variant="body2">{badge.description}</Typography>
      </CardContent>
    </Card>
  );
}
