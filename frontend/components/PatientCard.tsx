import { Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

export default function PatientCard({ patient }: { patient: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component={Link} href={`/patients/${patient._id}`}>{patient.firstName} {patient.lastName}</Typography>
        <Typography variant="body2">Email: {patient.email}</Typography>
        <Typography variant="body2">Phone: {patient.phone}</Typography>
      </CardContent>
    </Card>
  );
}
