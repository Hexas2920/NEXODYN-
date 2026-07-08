-- Run this SQL in your Neon.com project SQL Editor
-- Dashboard: https://console.neon.tech

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  delivery_interest TEXT,
  message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  device_type TEXT,
  os_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ifu_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  download_type TEXT NOT NULL,
  source TEXT NOT NULL,
  destination_url TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  os_name TEXT,
  status TEXT NOT NULL DEFAULT 'clicked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  os_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_requests_created_at
  ON access_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ifu_downloads_created_at
  ON ifu_downloads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_visits_created_at
  ON page_visits (created_at DESC);
