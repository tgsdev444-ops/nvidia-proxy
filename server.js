const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// The Reddit Fix: Increases payload size to prevent "Error 413"
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Bypasses the browser block (CORS)
app.use(cors());

// Forwards the chat to NVIDIA
app.use('/', createProxyMiddleware({
  target: 'https://integrate.api.nvidia.com',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Ensures your nvapi- key gets passed through safely
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  }
}));

app.listen(port, () => {
  console.log(`NVIDIA Proxy is running on port ${port}`);
});
