import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Alert, Button, CircularProgress } from "@mui/material";
import AppBase from "../../../components/AppBase";
import { harukiOAuth } from "../../../utils/oauth/haruki-oauth";
import HarukiOAuth from "../../../components/oauth/HarukiOAuth";

export default function OAuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = router.query.code;
      const state = router.query.state;

      if (!code || typeof code !== "string" || !state || typeof state !== "string") {
        const desc = router.query.error_description;
        setError(`授权失败：${desc}`); 
        setIsProcessing(false);
        return;
      }

      try {
        await harukiOAuth.handleCallback(code, state as string);
      } catch (err: any) {
        console.error("Token exchange failed:", err);
        setError(
          err.response?.data?.error_description ||
            err.message ||
            "授权失败，请重试"
        );
      } finally {
        setIsProcessing(false);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  const handleRetry = () => {
    router.push("/");
  };

  if (isProcessing) {
    return (
      <AppBase subtitle="授权处理中">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <CircularProgress />
          <Typography>正在处理授权，请稍候...</Typography>
        </Box>
      </AppBase>
    );
  }

  return (
    <AppBase subtitle="授权结果">
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <HarukiOAuth/>
      </Box>
    </AppBase>
  );
}
