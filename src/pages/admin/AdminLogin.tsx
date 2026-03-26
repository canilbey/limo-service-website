import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Box, Container, Paper, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { adminLogin } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import { brandColors } from '../../theme';
import GradientButton from '../../components/common/GradientButton';

export default function AdminLogin() {
  const { token, loading, setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rawFrom = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const from =
    rawFrom && rawFrom.startsWith('/admin') && rawFrom !== '/admin/login' ? rawFrom : '/admin/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: brandColors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: brandColors.primary }} />
      </Box>
    );
  }

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await adminLogin(username.trim(), password);
      setSession(res.token, res.username);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: `1px solid ${brandColors.border}`,
            backgroundColor: brandColors.card,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Admin sign in
          </Typography>
          <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 3 }}>
            Authorized personnel only. All access attempts are rate limited.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <GradientButton type="submit" disabled={submitting} fullWidth sx={{ py: 1.5, mt: 1 }}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </GradientButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
