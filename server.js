/**
 * Simple HTTP server to serve the DocNotary frontend on LAN.
 * Run: node server.js
 * Then access from any device on the same WiFi/LAN network.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const HOST = '0.0.0.0'; // Listen on all interfaces

// MIME types for common files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Serve index.html for root
  let filePath = req.url === '/' ? '/index.html' : req.url;
  // Strip query params
  filePath = filePath.split('?')[0];
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    // Allow cross-origin requests (needed for ethers.js CDN)
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

// Get all LAN IP addresses
function getLanIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal & non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({ name, address: iface.address });
      }
    }
  }
  return ips;
}

server.listen(PORT, HOST, () => {
  const lanIPs = getLanIPs();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔏  DocNotary — LAN Frontend Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`   Local:   http://localhost:${PORT}`);
  
  if (lanIPs.length > 0) {
    console.log('');
    console.log('   📱 Share these URLs with friends on your network:');
    lanIPs.forEach(ip => {
      console.log(`   → http://${ip.address}:${PORT}  (${ip.name})`);
    });
  }

  console.log('\n   Make sure Hardhat node is also running:');
  console.log('   npx hardhat node --hostname 0.0.0.0');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
