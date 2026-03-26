import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { fetchBookings, patchBooking, type AdminBookingRow } from '../../api/admin';
import { brandColors } from '../../theme';

export default function PendingApprovals() {
  const [tab, setTab] = useState(0);
  const [pendingRows, setPendingRows] = useState<AdminBookingRow[]>([]);
  const [approvedRows, setApprovedRows] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminBookingRow | null>(null);
  const [milesInput, setMilesInput] = useState('');
  const [approvedDialogRow, setApprovedDialogRow] = useState<AdminBookingRow | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetchBookings({ status: 'pending', limit: 200 }),
        fetchBookings({ status: 'approved', limit: 200 }),
      ]);
      setPendingRows(pendingRes.data);
      setApprovedRows(approvedRes.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setPendingRows([]);
      setApprovedRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const openPendingDetail = (row: AdminBookingRow) => {
    setDetail(row);
    setMilesInput(row.estimatedDistanceMiles != null ? String(row.estimatedDistanceMiles) : '');
  };

  const closePendingDetail = () => {
    setDetail(null);
    setMilesInput('');
  };

  const openApprovedDialog = (row: AdminBookingRow) => {
    setApprovedDialogRow(row);
    setAdminNotesInput(row.adminNotes ?? '');
  };

  const closeApprovedDialog = () => {
    setApprovedDialogRow(null);
    setAdminNotesInput('');
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
      closePendingDetail();
      await loadAll();
      if (status === 'approved') {
        setTab(1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const saveApprovedNoteOnly = async () => {
    if (!approvedDialogRow) return;
    setActionLoading(true);
    setError(null);
    try {
      await patchBooking(approvedDialogRow.id, { adminNotes: adminNotesInput.trim() || null });
      closeApprovedDialog();
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const markApprovedCompleted = async () => {
    if (!approvedDialogRow) return;
    setActionLoading(true);
    setError(null);
    try {
      await patchBooking(approvedDialogRow.id, {
        status: 'completed',
        adminNotes: adminNotesInput.trim() || null,
      });
      closeApprovedDialog();
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const renderPendingTable = () => (
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
          ) : pendingRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No pending requests.</TableCell>
            </TableRow>
          ) : (
            pendingRows.map((row) => (
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
                  <Button size="small" onClick={() => openPendingDetail(row)}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderApprovedTable = () => (
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
          ) : approvedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No approved bookings awaiting completion.</TableCell>
            </TableRow>
          ) : (
            approvedRows.map((row) => (
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
                  <Button size="small" onClick={() => openApprovedDialog(row)}>
                    Complete / notes
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Approvals
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 2 }}>
        Approve new requests first. After approval, use the Approved tab to add internal notes and mark trips as
        completed.
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label={`Pending (${pendingRows.length})`} />
        <Tab label={`Approved (${approvedRows.length})`} />
      </Tabs>

      {tab === 0 ? renderPendingTable() : renderApprovedTable()}

      <Dialog open={!!detail} onClose={closePendingDetail} fullWidth maxWidth="sm">
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
                <strong>Customer notes:</strong> {detail.driverNotes ?? '—'}
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
          <Button onClick={closePendingDetail} disabled={actionLoading}>
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

      <Dialog open={!!approvedDialogRow} onClose={closeApprovedDialog} fullWidth maxWidth="sm">
        <DialogTitle>Complete booking {approvedDialogRow?.reference}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {approvedDialogRow && (
            <>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                {approvedDialogRow.pickup}
                {approvedDialogRow.destination ? ` → ${approvedDialogRow.destination}` : ''}
              </Typography>
              <Typography variant="body2">
                Internal admin notes (optional before completion). Not shown to customers.
              </Typography>
              <TextField
                label="Admin notes"
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                multiline
                minRows={4}
                fullWidth
                slotProps={{ htmlInput: { maxLength: 4000 } }}
                helperText={`${adminNotesInput.length}/4000`}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={closeApprovedDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={() => void saveApprovedNoteOnly()} disabled={actionLoading}>
            Save note only
          </Button>
          <Button variant="contained" color="secondary" onClick={() => void markApprovedCompleted()} disabled={actionLoading}>
            Mark completed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
