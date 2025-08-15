import { Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function CaseCard({ caseData }: { caseData: any }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{caseData.title}</Typography>
        <Typography variant="body2">{caseData.description}</Typography>
        <Button variant="outlined" sx={{ mt: 1 }} component={Link} href={`/cases/${caseData._id}`}>View Details</Button>
      </CardContent>
    </Card>
  );
}
