import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { fetchBookings, patchBooking, type AdminBookingRow } from '../../api/admin';
import { brandColors } from '../../theme';

export default function PendingApprovals() {
  const [rows, setRows] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminBookingRow | null>(null);
  const [milesInput, setMilesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBookings({ status: 'pending', limit: 200 });
      setRows(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openDetail = (row: AdminBookingRow) => {
    setDetail(row);
    setMilesInput(row.estimatedDistanceMiles != null ? String(row.estimatedDistanceMiles) : '');
  };

  const closeDetail = () => {
    setDetail(null);
    setMilesInput('');
  };

  const applyDecision = async (status: 'approved' | 'rejected') => {
    if (!detail) return;
    setActionLoading(true);
    setError(null);
    try {
      const body: { status: 'approved' | 'rejected'; estimatedDistanceMiles?: number | null } = { status };
      if (milesInput.trim() !== '') {
        const miles = Number(milesInput);
        if (Number.isFinite(miles) && miles >= 0) {
          body.estimatedDistanceMiles = miles;
        }
      }
      await patchBooking(detail.id, body);
      closeDetail();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const markCompleted = async (row: AdminBookingRow) => {
    setActionLoading(true);
    setError(null);
    try {
      await patchBooking(row.id, { status: 'completed' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Pending approvals
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 2 }}>
        Review new booking requests and approve or reject them. You can record trip miles when approving.
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${brandColors.border}` }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: brandColors.cardElevated }}>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Pickup</TableCell>
              <TableCell>When</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading…</TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No pending requests.</TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.reference}</TableCell>
                  <TableCell>
                    {row.title} {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>{row.pickup}</TableCell>
                  <TableCell>
                    {row.serviceDate} {row.serviceTime}
                  </TableCell>
                  <TableCell>{row.vehicleName}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openDetail(row)} sx={{ mr: 1 }}>
                      Review
                    </Button>
                    <Button size="small" color="secondary" onClick={() => markCompleted(row)} disabled={actionLoading}>
                      Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!detail} onClose={closeDetail} fullWidth maxWidth="sm">
        <DialogTitle>Booking {detail?.reference}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {detail && (
            <>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                {detail.pickup}
                {detail.destination ? ` → ${detail.destination}` : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Sign:</strong> {detail.pickupSign ?? '—'}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {detail.phone}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {detail.email ?? '—'}
              </Typography>
              <Typography variant="body2">
                <strong>Notes:</strong> {detail.driverNotes ?? '—'}
              </Typography>
              {detail.additionalStops?.length ? (
                <Typography variant="body2">
                  <strong>Stops:</strong> {detail.additionalStops.join(' · ')}
                </Typography>
              ) : null}
              <TextField
                label="Estimated distance (miles)"
                value={milesInput}
                onChange={(e) => setMilesInput(e.target.value)}
                type="number"
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: 0.1 } }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDetail} disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="error" onClick={() => applyDecision('rejected')} disabled={actionLoading}>
            Reject
          </Button>
          <Button variant="contained" onClick={() => applyDecision('approved')} disabled={actionLoading}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
