import { Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function DoctorCard({ doctor }: { doctor: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component={Link} href={`/doctors/${doctor._id}`}>{doctor.firstName} {doctor.lastName}</Typography>
        <Typography variant="body2">Specialization: {doctor.specialization}</Typography>
        <Typography variant="body2">Email: {doctor.email}</Typography>
      </CardContent>
    </Card>
  );
}
