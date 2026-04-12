import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CircularIndeterminateProps {
  size?: number;
  showText?: boolean;
  compact?: boolean;  
}

export default function CircularIndeterminate({ 
  size = 50, 
  showText = true,
  compact = false 
}: CircularIndeterminateProps) {
  
  const loaderSize = compact ? 14 : size;
  const fontSize = compact ? 10 : 14;
  
  return (
    <Box
      sx={{
        width: compact ? 'auto' : '100%',
        height: compact ? 'auto' : '100%',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 0.5 : 2,
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          width: loaderSize,
          height: loaderSize,
          borderRadius: '50%',
          background: `
            conic-gradient(
              var(--color-primary) 0deg,
              var(--color-primary) 80deg,
              #e0e0e0 80deg,
              #f5f5f5 300deg
            )
          `,
          mask: 'radial-gradient(farthest-side, transparent 75%, black 76%)',
          WebkitMask: 'radial-gradient(farthest-side, transparent 75%, black 76%)',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />

      {showText && !compact && (
        <Typography
          sx={{
            fontSize: fontSize,
            letterSpacing: 1.5,
            fontWeight: 500,
            color: 'var(--color-primary)',
          }}
        >
          LOADING...
        </Typography>
      )}
    </Box>
  );
}
