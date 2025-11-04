# BidBuild UAE Platform - Production Deployment Guide

## 🚀 Quick Production Deployment

### Prerequisites
- Node.js 18+ and npm/pnpm
- MySQL 8.0+ database
- Domain name with SSL certificate
- VPS/Cloud server (2GB+ RAM, 20GB+ storage)

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install MySQL
sudo apt install mysql-server -y
```

### 2. Database Setup
```sql
-- Create production database
CREATE DATABASE bidbuild_uae_prod;
CREATE USER 'bidbuild_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON bidbuild_uae_prod.* TO 'bidbuild_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Application Deployment
```bash
# Clone repository
git clone https://github.com/CamelCod/idbuild-uae-platform.git
cd idbuild-uae-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.production
# Edit .env.production with your production settings

# Build frontend
npm run build

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.bidbuild.ae;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.bidbuild.ae;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/idbuild-uae-platform/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 5. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d api.bidbuild.ae
```

### 6. Database Migration
```bash
# Run migrations
npm run migrate:prod

# Seed initial data
npm run seed:prod
```

## 🏗️ Production Architecture

### Load Balancer (Nginx)
- SSL termination
- Static file serving
- API reverse proxy
- Rate limiting

### Application Server (Node.js + PM2)
- 4-8 worker processes
- Auto-restart on failure
- Log rotation
- Monitoring

### Database (MySQL)
- Read replicas for scaling
- Automated backups
- Connection pooling

### File Storage
- AWS S3 or local storage
- CDN integration
- Image optimization

## 🔧 Environment Configuration

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_USER=bidbuild_user
DB_PASSWORD=your_secure_password
DB_NAME=bidbuild_uae_prod

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/uploads

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@bidbuild.ae
SMTP_PASS=your_app_password

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=bidbuild-uae-uploads
AWS_REGION=us-east-1

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## 📊 Monitoring & Maintenance

### Health Check Endpoint
```bash
# Check application health
curl https://api.bidbuild.ae/api/health
```

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all
```

### Database Backup
```bash
#!/bin/bash
# Create backup script
BACKUP_DIR="/var/backups/bidbuild"
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u bidbuild_user -p bidbuild_uae_prod > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

## 🛡️ Security Checklist

- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] SSL certificate installed and auto-renewing
- [ ] Database credentials secured
- [ ] JWT secrets are unique and complex
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] File upload restrictions in place
- [ ] Error logging configured
- [ ] Regular security updates
- [ ] Backup strategy implemented

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple app servers
- Implement Redis for session storage
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Monitor CPU/Memory usage
- Optimize database queries
- Enable compression
- Implement caching strategies

### Monitoring Tools
- PM2 for process monitoring
- Nginx access logs
- Application performance monitoring
- Database performance monitoring

---

**Production Ready:** The BidBuild UAE platform is enterprise-ready with professional-grade architecture, security features, and monitoring capabilities.