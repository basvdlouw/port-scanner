[![GitHub Pages Deployment](https://github.com/Basvdlouw/port-scanner/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/Basvdlouw/port-scanner/actions/workflows/jekyll-gh-pages.yml)

# Port Scanner

Simple [website](https://basvdlouw.github.io/port-scanner/) for performing browser-based port scanning using different JavaScript APIs. Query parameters are available to configure the type of scan to execute. Code designed for experiments during master's [thesis](https://github.com/basvdlouw/master-thesis)

## Available Query Parameters

| Query Parameter    | Value                           | Description                                                                  |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------- |
| begin_port         | int (>= 0 and <= end_port)      | First port to scan                                                           |
| end_port           | int (> begin_port and <= 65535) | Last port to scan, all ports between begin_port and end_port will be scanned |
| n_scans            | int                             | N of scans on each individual port                                           |
| n_sockets          | int                             | N of parallel connections                                                    |
| socket_timeout     | int                             | Timeout of each scan on a port                                               |
| scanning_technique | fetch, xhr, websocket           | Scanning technique to use                                                    |

### Request Format

https://basvdlouw.github.io/port-scanner/?begin_port={int}&end_port={int}&n_scans={int}&n_sockets={int}&socket_timeout={int}&scanning_technique={str}

### Example Request

https://basvdlouw.github.io/port-scanner/?begin_port=1&end_port=65000&n_scans=1&n_sockets=100&socket_timeout=150&scanning_technique=fetch

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
