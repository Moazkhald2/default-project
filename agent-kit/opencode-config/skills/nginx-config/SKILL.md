# Nginx Configuration

Use for Nginx configuration tasks. Triggers: "nginx", "nginx config", "reverse proxy", "nginx server block", "load balancing", "ssl termination".

## Server Block (Virtual Host)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com;

    root /var/www/example.com/public;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}
```

## Location Matching

```nginx
# Priority (highest to lowest):
# 1. = exact          location = /api/health
# 2. ^~ prefix        location ^~ /static/
# 3. ~ case-sensitive regex   location ~ \.php$
# 4. ~* case-insensitive regex  location ~* \.(jpg|png)$
# 5. prefix            location /api/

# Exact match — highest priority
location = /favicon.ico {
    log_not_found off;
    access_log off;
}

# Prefix with priority
location ^~ /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Regex
location ~ \.php$ {
    fastcgi_pass unix:/var/run/php-fpm.sock;
    include fastcgi_params;
}
```

## Reverse Proxy

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Timeouts
    proxy_connect_timeout 5s;
    proxy_read_timeout 30s;
    proxy_send_timeout 30s;

    # Buffering
    proxy_buffering off;
    proxy_buffer_size 4k;
}
```

## Load Balancing

```nginx
upstream app {
    # Round robin (default)
    # least_conn  — for uneven loads
    # ip_hash     — session stickiness
    # random      — random distribution

    server app1:3000 weight=3;
    server app2:3000 weight=2;
    server app3:3000 backup;  # only if others down

    keepalive 32;
}

server {
    location / {
        proxy_pass http://app;
    }
}

# Health check (requires nginx plus or use passive)
server {
    location / {
        proxy_pass http://app;
        # Passive health checks:
        # fail_timeout and max_fails in upstream
    }
}
```

## SSL Termination

```nginx
server {
    listen 443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 8.8.8.8 valid=300s;
    resolver_timeout 5s;

    # HSTS (uncomment after testing)
    # add_header Strict-Transport-Security "max-age=63072000" always;
}

# Auto-renewal via certbot
# certbot --nginx -d example.com -d www.example.com
```

## Security Headers

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "0" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Content Security Policy
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.example.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://images.example.com;
    font-src 'self';
    connect-src 'self' https://api.example.com;
    frame-ancestors 'none';
    form-action 'self';
" always;
```

## Rate Limiting

```nginx
# Define limit zones
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;
limit_conn_zone $binary_remote_addr zone=conn:10m;

server {
    location /api/login {
        limit_req zone=login burst=3 nodelay;
        limit_req_status 429;
        proxy_pass http://backend;
    }

    location /api/ {
        limit_req zone=api burst=20;
        limit_conn conn 10;

        # Response when limited
        limit_req_status 429;
        limit_conn_status 503;
    }
}
```

## Compression

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    application/xml
    image/svg+xml
    font/woff2;

# Brotli (requires ngx_brotli module)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/javascript application/json;
```

## Caching Headers

```nginx
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

location / {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}

# Proxy cache
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=mycache:10m max_size=1g inactive=60m;
proxy_cache_key "$scheme$request_method$host$request_uri";

location /api/ {
    proxy_cache mycache;
    proxy_cache_valid 200 5m;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating;
    add_header X-Cache-Status $upstream_cache_status;
}
```

## Logging

```nginx
# Custom log format
log_format json_combined escape=json
    '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"remote_user":"$remote_user",'
    '"request":"$request",'
    '"status":$status,'
    '"body_bytes":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"http_referrer":"$http_referer",'
    '"http_user_agent":"$http_user_agent",'
    '"http_x_forwarded_for":"$http_x_forwarded_for"'
    '}';

access_log /var/log/nginx/access.log json_combined;

# Conditional logging
map $status $loggable {
    ~^[23]  0;
    default 1;
}
access_log /var/log/nginx/error_only.log combined if=$loggable;
```

## Health Check Endpoint

```nginx
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}

# Or proxy to backend health
location /healthz {
    proxy_pass http://backend:3000/health;
    proxy_cache off;
    access_log off;
}
```

## Complete Example

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Security
    include security-headers.conf;

    # Logging
    access_log /var/log/nginx/example.com.log json_combined;
    error_log /var/log/nginx/example.com.error.log;

    # Static files
    location / {
        root /var/www/example.com/dist;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    location /static/ {
        root /var/www/example.com/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Health
    location /health {
        access_log off;
        return 200 "ok";
    }

    # Rate limit
    location /api/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://app:3000;
    }
}
```

## Useful Commands

```bash
# Test config
nginx -t
nginx -t -c /etc/nginx/nginx.conf

# Reload
nginx -s reload

# Show config
nginx -T

# Log analysis
tail -f /var/log/nginx/access.log | goaccess --log-format=COMBINED -

# Traffic
netstat -tulpn | grep :80
ss -tulpn | grep nginx
```
