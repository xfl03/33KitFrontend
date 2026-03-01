import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  harukiOAuth,
  UserProfile,
} from "../../utils/oauth/haruki-oauth";

const DEFAULT_SCOPES = ["user:read", "bindings:read", "game-data:read"];

interface HarukiOAuthStatusProps {
  scopes?: string[];
  onLoginSuccess?: () => void;
  onLogout?: () => void;
}

export function useHarukiOAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (harukiOAuth.isAuthenticated()) {
        setIsAuthorized(true);
        try {
          const profile = await harukiOAuth.getUserProfile();
          setUser(profile);
        } catch {
          harukiOAuth.clearTokens();
          setIsAuthorized(false);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async () => {
    try {
      const url = await harukiOAuth.getAuthorizationUrl(DEFAULT_SCOPES);
      window.location.href = url;
    } catch (error) {
      console.error("Failed to start authorization:", error);
    }
  };

  const logout = () => {
    harukiOAuth.clearTokens();
    setIsAuthorized(false);
    setUser(null);
    window.location.reload();
  };

  return { isAuthorized, user, isLoading, login, logout };
}

export default function HarukiOAuth({
  scopes = DEFAULT_SCOPES,
  onLoginSuccess,
  onLogout,
}: HarukiOAuthStatusProps) {
  const { isAuthorized, user, isLoading, login, logout } = useHarukiOAuth();

  useEffect(() => {
    if (isAuthorized && !isLoading && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isAuthorized, isLoading, onLoginSuccess]);

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={24} />
        <Typography variant="body2">加载中...</Typography>
      </Box>
    );
  }

  if (isAuthorized && user) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={user.avatarPath}
          alt={user.name}
          sx={{ width: 32, height: 32 }}
        >
          {user.name.charAt(0)}
        </Avatar>
        <Typography variant="body2">{user.name}</Typography>
        <Button size="small" variant="outlined" onClick={handleLogout}>
          退出登录
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button variant="outlined" onClick={login} style={{ width: "457px" }}>
        点这里关联Haruki工具箱账号，授权给33Kit读取（可选）
      </Button>
    </Box>
  );
}
