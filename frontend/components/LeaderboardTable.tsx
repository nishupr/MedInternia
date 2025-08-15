import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function LeaderboardTable({ leaders }: { leaders: any[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leaders.map(l => (
          <TableRow key={l._id}>
            <TableCell>{l.name}</TableCell>
            <TableCell>{l.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
