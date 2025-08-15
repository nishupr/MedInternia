import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import api from '../../utils/api';

export default function AISuggestions() {
  const [caseId, setCaseId] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/cases/${caseId}/ai-suggestions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestions(res.data.data.suggestions || []);
    } catch {
      setError('Failed to fetch AI suggestions');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>AI Suggestions for Case</Typography>
        <TextField label="Case ID" value={caseId} onChange={e => setCaseId(e.target.value)} fullWidth margin="normal" />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleGetSuggestions}>Get Suggestions</Button>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {suggestions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Suggestions:</Typography>
            {suggestions.map((s, idx) => (
              <Alert key={idx} severity="info" sx={{ mb: 1 }}>{s}</Alert>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
