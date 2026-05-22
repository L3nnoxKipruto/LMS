import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      aria-labelledby="jifunzehub-dialog-title"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '16px',
          padding: '8px',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <DialogTitle id="jifunzehub-dialog-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
        <span className="font-extrabold text-lg text-zinc-900">{title}</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', borderBottom: actions ? '1px solid' : 'none' }}>
        <div className="text-sm text-zinc-600 mt-2">
          {children}
        </div>
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
