# QuantBroker Frontend

This project implements a sleek portfolio allocation dashboard using React, TypeScript and Tailwind CSS.
It visualises asset allocations, the efficient frontier, value at risk, portfolio correlations and returns.
Animated backgrounds and live number updates make the interface highly dynamic.

## Folder Structure

- `src/PortfolioAllocationDashboard.tsx` – main dashboard component
- `src/components/*` – reusable UI elements including dynamic background,
  starfield overlay, loading spinner and animated numbers
- `AGENTS.md` – commit guidelines for future contributors

## Connecting to the Backend

All data is fetched from a separate API. Set the environment variables
`NEXT_PUBLIC_API_BASE_PAPER` and `NEXT_PUBLIC_API_BASE_LIVE` to the root URLs of
your backend instances. The recommended backend is
[Portfolio_Allocation_System](https://github.com/KilianC3/Portfolio_Allocation_System).
If `NEXT_PUBLIC_API_BASE_LIVE` is omitted, the paper URL will be used for both
modes.

To run the backend locally:

```bash
# Clone and set up the Python backend
git clone https://github.com/KilianC3/Portfolio_Allocation_System.git
cd Portfolio_Allocation_System
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload
```

Once running, configure this frontend to point at the paper and live API bases:

```bash
export NEXT_PUBLIC_API_BASE_PAPER=http://localhost:8000
# Optional live URL
export NEXT_PUBLIC_API_BASE_LIVE=https://api.example.com
```

The dashboard will then request data from endpoints like `/api/assets`,
`/api/efficient_frontier` and `/api/portfolio_returns`.
Use the **Database** tab to browse backend tables and export their contents as CSV.

## Development

This repository contains only source files. To integrate into an existing React
project, copy the `src/` directory and ensure your build pipeline resolves the
`@/` alias to your project root.

Format code with Prettier before committing:

```bash
npx prettier --write src
```

Lint and test commands are omitted here because no `package.json` is included.

## Deploying the Frontend

These source files are intended to be integrated into a React or Next.js
application. The easiest way to get started is with `create-next-app` which
sets up React, TypeScript and Tailwind CSS out of the box:

```bash
npx create-next-app@latest quantbroker-frontend --typescript --tailwind
cd quantbroker-frontend

# Replace the generated `src` directory with the contents of this repository
rm -rf src
cp -R /path/to/cloned/repo/src ./src

# Configure the API endpoints
cat <<EOF > .env.local
NEXT_PUBLIC_API_BASE_PAPER=http://localhost:8000
# Optional live trading API
NEXT_PUBLIC_API_BASE_LIVE=https://api.example.com
EOF

npm run dev
```

This starts a local development server at `http://localhost:3000`. To create a
production build and run it:

```bash
npm run build
npm start
```

Deployments on platforms like Vercel or Netlify simply need the above
environment variables defined. The application is entirely client side and can
scale horizontally with ease.

## Exposing the Frontend with Cloudflare Tunnel

When running inside an LXC container you can make the dashboard publicly
available using a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/). Install `cloudflared` in the
container, authenticate and create a tunnel:

```bash
cloudflared tunnel login
cloudflared tunnel create quantbroker
```

Create a configuration file named `cloudflared.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json
ingress:
  - hostname: dash.example.com
    service: http://localhost:3000
  - service: http_status:404
```

Run the tunnel with:

```bash
cloudflared --config cloudflared.yml tunnel run
```

Restrict access to the hostname using Cloudflare Access for an additional layer
of authentication and automatic TLS.

## Stand-alone HTML Demo

The `demo.html` file contains everything needed to preview the dashboard layout
without running any backend. All JavaScript dependencies are embedded directly
in the HTML so it works completely offline. To view it:

1. Locate `demo.html` in the repository root.
2. Open the file directly in any modern web browser (double click or use
   `File > Open`).

No additional server or configuration is required because the demo uses static
placeholder data and bundles React, Tailwind CSS, and Recharts directly in
`demo.html`.
