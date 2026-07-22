# Sims 2 Login Screen Customization

## Overview

The login screen (`authorize.html`) is rendered by `<ha-authorize>` and `<ha-auth-flow>` web components as a separate HTML page that is NOT part of the main Home Assistant SPA. Because of this architecture, standard theme YAML does NOT apply to the login page.

## Customization Options

Since the login page is external to the main SPA, theming options are limited to:

### 1. Reverse Proxy CSS Injection (Recommended for most users)

If you run Home Assistant behind a reverse proxy (nginx, Caddy, Traefik, etc.), you can inject custom CSS into the login page.

#### Nginx Example:
```nginx
location /auth/ {
    proxy_pass http://homeassistant:8123/auth/;
    sub_filter '</head>' '<style>
      /* Sims 2 Login Screen Customization */
      body {
        background-color: #0E1628 !important;
        background-image:
          radial-gradient(ellipse 40% 35% at 50% 30%, rgba(74, 222, 128, 0.10) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232, 180, 77, 0.04) 0%, transparent 60%),
          radial-gradient(ellipse 25% 55% at 60% 30%, rgba(74, 160, 210, 0.12) 0%, transparent 100%),
          radial-gradient(ellipse 20% 50% at 75% 35%, rgba(56, 120, 180, 0.08) 0%, transparent 100%),
          radial-gradient(ellipse 22% 45% at 70% 45%, rgba(74, 160, 210, 0.10) 0%, transparent 100%),
          radial-gradient(ellipse 20% 40% at 55% 55%, rgba(56, 120, 180, 0.07) 0%, transparent 100%),
          radial-gradient(ellipse 22% 45% at 35% 45%, rgba(74, 160, 210, 0.10) 0%, transparent 100%),
          radial-gradient(ellipse 20% 50% at 25% 35%, rgba(56, 120, 180, 0.08) 0%, transparent 100%),
          radial-gradient(ellipse 25% 55% at 40% 30%, rgba(74, 160, 210, 0.12) 0%, transparent 100%),
          radial-gradient(ellipse 20% 50% at 50% 15%, rgba(74, 160, 210, 0.08) 0%, transparent 100%),
          radial-gradient(ellipse 22% 50% at 68% 25%, rgba(100, 170, 220, 0.06) 0%, transparent 100%),
          radial-gradient(ellipse 22% 50% at 32% 25%, rgba(100, 170, 220, 0.06) 0%, transparent 100%),
          radial-gradient(ellipse 18% 40% at 80% 40%, rgba(56, 120, 180, 0.05) 0%, transparent 100%),
          radial-gradient(ellipse 18% 40% at 20% 40%, rgba(56, 120, 180, 0.05) 0%, transparent 100%),
          radial-gradient(ellipse 75% 75% at 50% 30%, transparent 10%, rgba(14, 22, 40, 0.6) 100%);
        background-attachment: fixed !important;
        font-family: var(--sims2-font-body, "Benguiat Gothic", system-ui, sans-serif) !important;
        color: #2A2320 !important;
      }

      .login-card,
      [class*="login"] {
        background: linear-gradient(
          180deg,
          #A8D8F0 0%,
          var(--sims2-sky-blue, #7EC8E6) 50%,
          #5BB4D8 100%
        ) !important;
        border: 3px solid var(--sims2-panel-blue-deep, #173A52) !important;
        border-radius: 24px !important;
        box-shadow:
          0 8px 48px rgba(26, 26, 62, 0.25),
          0 2px 12px rgba(26, 26, 62, 0.15),
          inset 0 2px 0 rgba(255, 255, 255, 0.7) !important;
      }

      .login-card h1,
      .login-card .login-brand h1 {
        color: var(--sims2-gold, #E8B44D) !important;
        font-family: var(--sims2-font-display, "Benguiat Gothic", Georgia, serif) !important;
        text-shadow: 0 1px 3px rgba(232, 180, 77, 0.4) !important;
        letter-spacing: 0.06em !important;
      }

      .login-card ha-textfield,
      .login-card paper-input-container {
        border-radius: 12px !important;
        --mdc-shape-large: 12px !important;
        --mdc-shape-medium: 12px !important;
        background-color: rgba(126, 200, 230, 0.5) !important;
      }

      .login-card mwc-button,
      .login-card .login-form button {
        background: linear-gradient(
          180deg,
          #6EE7A0 0%,
          var(--sims2-plumbob-green, #7BC942) 40%,
          #22C55E 100%
        ) !important;
        border-radius: 12px !important;
        box-shadow:
          0 2px 8px rgba(74, 222, 128, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        border: 2px solid #16A34A !important;
        font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif) !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
      }

      .login-card mwc-button:hover {
        background: linear-gradient(180deg, #A7F3D0 0%, var(--sims2-plumbob-green, #7BC942) 100%) !important;
        box-shadow: 0 0 16px rgba(74, 222, 128, 0.5) !important;
      }
    </style></head>';
    proxy_set_header Accept-Encoding "";
}
```

#### Caddy Example:
```caddy
reverse_proxy /auth/* http://homeassistant:8123 {
    header_up Host {upstream_hostport}
    header_up X-Real-IP {remote_host}
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Proto {scheme}
    response body {
        import secure_headers
        replace </head> 
            <style>
            /* Sims 2 Login Screen CSS (same as above) */
            </style>
        </head>
    }
}
```

### 2. Development Repository Approach

For advanced users who want complete control:

1. Fork the Home Assistant frontend repository
2. Modify `www/auth/authorize.html` directly
3. Apply the Sims 2 CSS styling shown above
4. Build and run your custom fork

Note: This approach requires maintaining a custom build and may not be suitable for all installations (especially Home Assistant OS).

### 3. Browser Mod Limitation

Browser Mod cannot style the pre-auth login screen because it only works after authentication. The login page loads its own JavaScript bundle and does not load `extra_module_url` resources from `configuration.yaml`.

## Implementation Notes

The CSS provided above implements:
- Sunburst background matching the main app
- Sims 2 styled login card with sky-blue gradient
- Bubbly rounded borders (24px radius)
- Benguiat Gothic typography
- Gold accent colors for titles and hover states
- Proper input field styling
- Plumbob-green themed buttons

## Testing

To test your login screen customization:
1. Apply your reverse proxy configuration
2. Reload the proxy
3. Navigate to your Home Assistant login page
4. Verify the Sims 2 styling appears correctly
5. Test login functionality to ensure it still works

## Troubleshooting

- If styles don't appear, check your proxy logs for sub_filter/substitution errors
- Ensure you're not double-encoding HTML entities in your CSS injection
- Verify that the `Accept-Encoding` header is cleared to prevent compression issues
- Test with browser developer tools to inspect applied styles