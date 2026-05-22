import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  width = 360,
}) => {
  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          width,
          backgroundColor: 'background.paper',
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="flex justify-between items-center border-b border-zinc-100 pb-4 mb-4">
          <span className="font-extrabold text-lg text-zinc-900">{title || 'Menu'}</span>
          <IconButton onClick={onClose} aria-label="close drawer" size="small">
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
      </Box>
    </MuiDrawer>
  );
};
