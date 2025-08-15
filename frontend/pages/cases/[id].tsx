import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent, Button, TextField, Menu, MenuItem, IconButton, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function CaseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [caseData, setCaseData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    api.get(`/cases/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCaseData(res.data.data.case);
        setComments(res.data.data.case.comments || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch case');
        setLoading(false);
      });
  }, [id]);

  const handleComment = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/cases/${id}/comments`, { content: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment('');
      // Refresh comments
      const res = await api.get(`/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data.data.case.comments || []);
    } catch {
      setError('Failed to add comment');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!caseData) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>{caseData.title}</Typography>
        <Typography variant="body1">{caseData.description}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Comments</Typography>
          <Stack spacing={2}>
            {comments.map((c, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                drag='x'
                dragConstraints={{ left: -20, right: 20 }}
              >
                <Card sx={{ mb: 1, cursor: 'grab', transition: 'box-shadow 0.3s' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2">{c.content}</Typography>
                        <Typography variant="caption">By: {c.author?.firstName || 'Unknown'}</Typography>
                      </Box>
                      <IconButton size="small" onClick={e => { setAnchorEl(e.currentTarget); setSelectedComment(idx); }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setAnchorEl(null); }}>Reply</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); }}>Report</MenuItem>
          </Menu>
          <Box sx={{ mt: 2 }}>
            <TextField label="Add Comment" value={comment} onChange={e => setComment(e.target.value)} fullWidth />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="contained" color="primary" sx={{ mt: 1, boxShadow: 2 }} onClick={handleComment}>
                Submit
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
