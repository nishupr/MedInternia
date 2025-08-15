import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)' }}>
      <Toolbar>
        <IconButton color="inherit" component={Link} href="/" sx={{ mr: 2 }}>
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          Med-Internia
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/cases">Cases</Button>
          <Button color="inherit" component={Link} href="/badges">Badges</Button>
          <Button color="inherit" component={Link} href="/certificates">Certificates</Button>
          <Button color="inherit" component={Link} href="/jobs">Jobs</Button>
          <Button color="inherit" component={Link} href="/webinars">Webinars</Button>
          <Button color="inherit" component={Link} href="/peer-reviews">Peer Reviews</Button>
          <Button color="inherit" component={Link} href="/leaderboard">Leaderboard</Button>
          <Button color="inherit" component={Link} href="/search">Search</Button>
          <Button color="inherit" component={Link} href="/auth/login">Login</Button>
        </Box>
        <IconButton color="inherit" component={Link} href="/about" sx={{ ml: 2 }}>
          <InfoIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
