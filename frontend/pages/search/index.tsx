import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import api from '../../utils/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query }
      });
      setResults(res.data.data.results || []);
    } catch {
      setError('Search failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Advanced Search</Typography>
        <Box sx={{ mb: 2 }}>
          <TextField label="Search" value={query} onChange={e => setQuery(e.target.value)} sx={{ mr: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
        </Box>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {results.map(r => (
          <Card key={r._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{r.title || r.name}</Typography>
              <Typography variant="body2">{r.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
