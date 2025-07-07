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

All data is fetched from a separate API. Set the environment variable
`NEXT_PUBLIC_API_BASE` to the root URL of your backend instance. The recommended
backend is [Portfolio_Allocation_System](https://github.com/KilianC3/Portfolio_Allocation_System).

To run the backend locally:

```bash
# Clone and set up the Python backend
git clone https://github.com/KilianC3/Portfolio_Allocation_System.git
cd Portfolio_Allocation_System
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload
```

Once running, configure this frontend to point at `http://localhost:8000`:

```bash
export NEXT_PUBLIC_API_BASE=http://localhost:8000
```

The dashboard will then request data from endpoints like `/api/assets`,
`/api/efficient_frontier` and `/api/portfolio_returns`.

## Development

This repository contains only source files. To integrate into an existing React
project, copy the `src/` directory and ensure your build pipeline resolves the
`@/` alias to your project root.

Format code with Prettier before committing:

```bash
npx prettier --write src
```

Lint and test commands are omitted here because no `package.json` is included.
