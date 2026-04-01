import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  fetchBookings,
  patchBooking,
  deleteBooking,
  type AdminBookingRow,
} from '../../api/admin';
import { brandColors } from '../../theme';
import AdminBookingDetailBody from '../../components/admin/AdminBookingDetailBody';

export default function CustomerHistory() {
  const [rows, setRows] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('all');
  const [detail, setDetail] = useState<AdminBookingRow | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBookings({ status: status === 'all' ? undefined : status, limit: 500 });
      setRows(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  const openDetail = (row: AdminBookingRow) => {
    setDetail(row);
    setAdminNotesInput(row.adminNotes ?? '');
  };

  const closeDetail = () => {
    setDetail(null);
    setAdminNotesInput('');
    setDeleteConfirmOpen(false);
  };

  const saveNotes = async () => {
    if (!detail) return;
    setActionLoading(true);
    setError(null);
    try {
      await patchBooking(detail.id, { adminNotes: adminNotesInput.trim() || null });
      await load();
      closeDetail();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const performDelete = async () => {
    if (!detail) return;
    setActionLoading(true);
    setError(null);
    try {
      await deleteBooking(detail.id);
      closeDetail();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setActionLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const columns: GridColDef<AdminBookingRow>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'reference', headerName: 'Ref', minWidth: 110, flex: 0.6 },
      {
        field: 'customer',
        headerName: 'Customer',
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) => `${row.title} ${row.firstName} ${row.lastName}`,
      },
      { field: 'phone', headerName: 'Phone', minWidth: 140, flex: 0.8, sortable: false },
      { field: 'pickup', headerName: 'Pickup', flex: 1, minWidth: 160 },
      { field: 'destination', headerName: 'Destination', flex: 1, minWidth: 120 },
      { field: 'serviceDate', headerName: 'Date', minWidth: 110 },
      { field: 'vehicleName', headerName: 'Vehicle', minWidth: 130, flex: 0.7 },
      {
        field: 'adminNotes',
        headerName: 'Admin notes',
        minWidth: 140,
        flex: 0.7,
        sortable: false,
        renderCell: (params) => {
          const text = params.value ? String(params.value) : '—';
          return (
            <span
              title={params.value ? String(params.value) : ''}
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 220,
              }}
            >
              {text}
            </span>
          );
        },
      },
      { field: 'status', headerName: 'Status', minWidth: 110 },
      { field: 'createdAt', headerName: 'Submitted', minWidth: 160, flex: 0.8 },
      {
        field: 'actions',
        headerName: '',
        width: 100,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              openDetail(params.row);
            }}
          >
            Open
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Customer history
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.textSecondary, mb: 2 }}>
        Click a row or use Open to view the full trip, edit internal notes, or delete a record.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ height: 640, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(r) => r.id}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick
          onRowClick={(params) => openDetail(params.row)}
          sx={{
            borderColor: brandColors.border,
            color: '#fff',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: brandColors.cardElevated },
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: 'rgba(255,255,255,0.02)' },
            '& .MuiDataGrid-cell': { borderColor: brandColors.border },
          }}
        />
      </Box>

      <Dialog open={!!detail} onClose={closeDetail} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>Booking {detail?.reference}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {detail && (
            <>
              <AdminBookingDetailBody booking={detail} />
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Internal admin notes (not shown to customers).
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
          <Button color="error" onClick={() => setDeleteConfirmOpen(true)} disabled={actionLoading}>
            Delete record
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={closeDetail} disabled={actionLoading}>
            Close
          </Button>
          <Button variant="contained" onClick={() => void saveNotes()} disabled={actionLoading}>
            Save notes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete booking?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This permanently removes booking {detail?.reference} from history. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => void performDelete()} disabled={actionLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
