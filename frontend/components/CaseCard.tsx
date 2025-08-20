import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function CaseCard({ caseData }: { caseData: any }) {
  // Status accent color and icon
  const statusMap = {
    Open: { color: "#1976d2", icon: "🔵" },
    Closed: { color: "#bdbdbd", icon: "🔒" },
    Pending: { color: "#64b5f6", icon: "⏳" },
  };

  const status: keyof typeof statusMap =
    (caseData?.status as keyof typeof statusMap) || "Open";
  const accent = statusMap[status] || statusMap["Open"];

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        animation: "fadeInCard 0.7s",
        p: 2,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header with icon + title + status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Typography fontSize={28} sx={{ color: accent.color }}>
            {accent.icon}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#1565c0"
            sx={{ flex: 1, letterSpacing: 0.5 }}
          >
            {caseData?.title || "Untitled Case"}
          </Typography>
          <Box
            sx={{
              px: 2,
              py: 0.7,
              borderRadius: 2,
              background: accent.color,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 1px 4px #2193b022",
              letterSpacing: 1,
            }}
          >
            {status}
          </Box>
        </Box>

        {/* View Details Button */}
        <Button
          variant="contained"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.1,
            fontWeight: 700,
            fontSize: "1.05rem",
            background: "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px #2193b044",
            mt: 1,
            letterSpacing: 1,
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 0%, #2193b0 100%)",
              color: "#fff",
              boxShadow: "0 4px 16px #2193b066",
              filter: "brightness(1.08)",
              transform: "scale(1.03)",
            },
          }}
          component={Link}
          href={caseData?._id ? `/cases/${caseData._id}` : "#"}
        >
          VIEW DETAILS
        </Button>
      </CardContent>

      <style jsx global>{`
        @keyframes fadeInCard {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </Card>
  );
}
