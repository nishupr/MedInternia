import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const mockData = ["Result 1", "Result 2", "Result 3"];

  const performSearch = (q: string) => {
    const trimmed = (q || "").trim();
    setQuery(trimmed);
    if (!trimmed) {
      setResults([]);
      setSearched(true);
      return;
    }
    const found = mockData.filter((item) => item.toLowerCase().includes(trimmed.toLowerCase()));
    setResults(found);
    setSearched(true);
  };

  // Enter key handler on the text field
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(query);
    }
  };

  // If query provided via URL (?q=...), perform search on mount/update
  useEffect(() => {
    const q = typeof router.query.q === "string" ? router.query.q : router.query.q?.[0] || "";
    if (q) {
      performSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.q]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Search placeholder — use the header search to perform queries */}
      <Box sx={{ mb: 4 }} />

      {/* Search Results */}
      {!searched ? (
        <Typography variant="body1" align="center" color="text.secondary">
          Type a term above and press Enter to search.
        </Typography>
      ) : results.length > 0 ? (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {results.map((item, index) => (
            <Box key={index} flex="1 1 calc(33.33% - 16px)">
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{item}</Typography>
                <Typography variant="body2">This is a preview of the search result content.</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" align="center" color="text.secondary">
          No results found for "{query}".
        </Typography>
      )}
    </Container>
  );
}
