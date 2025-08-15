import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, MenuItem } from '@mui/material';
import api from '../../utils/api';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'patient',
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Doctor fields
    specialization: '',
    licenseNumber: '',
    experience: '',
    qualifications: '',
    // Intern fields
    medicalSchool: '',
    yearOfStudy: '',
    interests: '',
    mentorDoctor: '',
    // Patient fields
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalHistory: '',
    allergies: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="First Name" name="firstName" fullWidth margin="normal" value={form.firstName} onChange={handleChange} required />
          <TextField label="Last Name" name="lastName" fullWidth margin="normal" value={form.lastName} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={form.email} onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} required />
          <TextField select label="User Type" name="userType" fullWidth margin="normal" value={form.userType} onChange={handleChange} required>
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="intern">Intern</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <TextField label="Phone" name="phone" fullWidth margin="normal" value={form.phone} onChange={handleChange} />
          <TextField label="Date of Birth" name="dateOfBirth" type="date" fullWidth margin="normal" value={form.dateOfBirth} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField select label="Gender" name="gender" fullWidth margin="normal" value={form.gender} onChange={handleChange}>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          {/* Doctor-specific fields */}
          {form.userType === 'doctor' && (
            <>
              <TextField label="Specialization" name="specialization" fullWidth margin="normal" value={form.specialization} onChange={handleChange} required />
              <TextField label="License Number" name="licenseNumber" fullWidth margin="normal" value={form.licenseNumber} onChange={handleChange} required />
              <TextField label="Experience (years)" name="experience" type="number" fullWidth margin="normal" value={form.experience} onChange={handleChange} />
              <TextField label="Qualifications (comma separated)" name="qualifications" fullWidth margin="normal" value={form.qualifications} onChange={handleChange} />
            </>
          )}

          {/* Intern-specific fields */}
          {form.userType === 'intern' && (
            <>
              <TextField label="Medical School" name="medicalSchool" fullWidth margin="normal" value={form.medicalSchool} onChange={handleChange} required />
              <TextField label="Year of Study" name="yearOfStudy" type="number" fullWidth margin="normal" value={form.yearOfStudy} onChange={handleChange} required />
              <TextField label="Interests (comma separated)" name="interests" fullWidth margin="normal" value={form.interests} onChange={handleChange} />
              <TextField label="Mentor Doctor ID (optional)" name="mentorDoctor" fullWidth margin="normal" value={form.mentorDoctor} onChange={handleChange} />
            </>
          )}

          {/* Patient-specific fields */}
          {form.userType === 'patient' && (
            <>
              <TextField label="Emergency Contact Name" name="emergencyContactName" fullWidth margin="normal" value={form.emergencyContactName} onChange={handleChange} />
              <TextField label="Emergency Contact Phone" name="emergencyContactPhone" fullWidth margin="normal" value={form.emergencyContactPhone} onChange={handleChange} />
              <TextField label="Emergency Contact Relationship" name="emergencyContactRelationship" fullWidth margin="normal" value={form.emergencyContactRelationship} onChange={handleChange} />
              <TextField label="Medical History (comma separated)" name="medicalHistory" fullWidth margin="normal" value={form.medicalHistory} onChange={handleChange} />
              <TextField label="Allergies (comma separated)" name="allergies" fullWidth margin="normal" value={form.allergies} onChange={handleChange} />
            </>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}
