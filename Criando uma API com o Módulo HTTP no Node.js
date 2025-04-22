const http = require('http');
const url = require('url');
let counter = 0;

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'GET' && pathname === '/health-check') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString()
    }));
    return;
  }

 
  if (req.method === 'GET' && pathname === '/is-prime-number') {
    const number = parseInt(query.number);
    if (!number || number < 1) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid input' }));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ isPrime: isPrime(number) }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/count') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const inc = parsed.incrementBy;
        if (typeof inc === 'number' && inc > 0 && Number.isInteger(inc)) {
          counter += inc;
          res.writeHead(200);
          res.end(JSON.stringify({ counter }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid input' }));
        }
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid input' }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
if (req.method === 'GET' && pathname === '/is-prime-number') {
  const number = parseInt(query.number);
  if (isNaN(number) || number < 1) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Invalid input" }));
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify({ isPrime: isPrime(number) }));
  return;
}
if (req.method === 'POST' && pathname === '/count') {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const incrementBy = data.incrementBy;
      if (!Number.isInteger(incrementBy) || incrementBy <= 0) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid input" }));
        return;
      }
      counter += incrementBy;
      res.writeHead(200);
      res.end(JSON.stringify({ counter }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Invalid input" }));
    }
  });

  return;
}
