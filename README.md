[![GitHub Pages Deployment](https://github.com/Basvdlouw/port-scanner/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/Basvdlouw/port-scanner/actions/workflows/jekyll-gh-pages.yml)

[Port Scanner](https://basvdlouw.github.io/port-scanner/)

# Example request

https://basvdlouw.github.io/port-scanner/?begin_port=1&end_port=65000&n_scans=1&n_sockets=100&socket_timeout=150&scanning_technique=fetch

# Port Scanner

Application for performing browser-based port scanning using different JavaScript APIs

# Project structure

- Project uses npm to manage packages
- Project uses TypeScript and enforces certain code styling guides using `.eslintrc.js`
- `./server` containing server side code
- `./client` containing files that will be served to the client

# Prerequisites

- Node.JS (Version 18.14.2 was used for the project)

# Available commands

```
npm run clean
```

Cleans `./dist` folder

```
npm run build
```

Runs clean, compiles TypeScript to JavaScript, and copies static files to `./dist` folder.

```
npm start
```

Builds and serves the application on `http://localhost:3000`.
