# Frontend - Fullstack GraphQL App

This is a minimal frontend scaffold using:

- React (Vite)
- Redux Toolkit
- Apollo Client (GraphQL)
- Tailwind CSS

Quick start

1. Open a terminal and change into the frontend folder:

```powershell
cd frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

By default the app will try to query the GraphQL server at `http://localhost:4000/graphql`. You can change this by editing `.env` (Vite env variables must start with `VITE_`):

```
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

Notes & next steps

- Tailwind is configured; you may need to restart the dev server after first install.
- This scaffold uses `fetch` in the Redux thunks to call the GraphQL endpoint. Apollo Client is also configured and wrapped around the app if you prefer to use it directly inside components.
- Add more slices and components as needed.
