import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  // Prevents the site from being embedded in iframes (clickjacking protection)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Stops browsers from MIME-sniffing the content type
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controls how much referrer info is sent
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Forces HTTPS for 1 year (only meaningful when deployed on HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Disables access to sensitive browser features not needed by a portfolio
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Prevents XSS via DNS prefetch
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Content Security Policy
  // Dev: allows unsafe-eval so React error overlay + HMR work
  // Prod: removes unsafe-eval — tight rules
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Dev needs unsafe-eval for React internals; prod does not
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.emailjs.com"
        : "script-src 'self' 'unsafe-inline' https://cdn.emailjs.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://api.emailjs.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Remove the X-Powered-By: Next.js header (reduces fingerprinting)
  poweredByHeader: false,

  // Compress responses
  compress: true,
};

export default nextConfig;
