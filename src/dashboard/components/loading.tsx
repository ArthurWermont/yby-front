import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading({ message }: { message: string }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
      gap={2}
    >
      <CircularProgress size={48} thickness={4} color="success" />
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
}
