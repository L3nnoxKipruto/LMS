import React from 'react';
import MuiTooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

const TooltipComp = MuiTooltip as any;

export interface TooltipProps {
  title: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
}) => {
  return (
    <TooltipComp
      title={title}
      placement={placement}
      arrow
      TransitionComponent={Zoom}
      enterDelay={200}
      leaveDelay={100}
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontSize: '0.75rem',
          borderRadius: '6px',
          fontWeight: 500,
        },
        '& .MuiTooltip-arrow': {
          color: '#0f172a',
        },
      }}
    >
      {children}
    </TooltipComp>
  );
};
