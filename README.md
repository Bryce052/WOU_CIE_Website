# WOU Cybercrime website

Complete portable version of the approved redesign: homepage, About, Research, Curriculum, Projects, People, stylesheet, JavaScript, WOU logos, fonts, and generated illustrations.

## Run locally (Windows, macOS, or Linux)

1. Extract the ZIP.
2. Install Node.js 22 or later from https://nodejs.org if needed.
3. Open a terminal in the extracted `wou-cybercrime` folder (the folder containing `package.json`).
4. Run:

```sh
npm start
```

5. Open http://localhost:3000 in a browser. Stop the server with Ctrl+C.

No npm dependencies, API keys, database, or build step are required. On Windows you can also double-click `start-local.bat`. Serve the website through the local server rather than double-clicking `public/index.html`, because page and asset links begin at `/`.

Optional development mode: `npm run dev` restarts the server when server code changes. Refresh the browser after editing HTML, CSS, or client JavaScript.

If port 3000 is in use, choose another port:

PowerShell:

```powershell
$env:PORT=3001
npm start
```

macOS/Linux:

```sh
PORT=3001 npm start
```

## Push to GitHub

Create an empty GitHub repository, then run these commands from the folder containing `package.json`. Replace `YOUR-USERNAME` with your GitHub username and use your chosen repository name.

```sh
git init
git add .
git commit -m "Add WOU cybercrime website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wou-cybercrime.git
git push -u origin main
```

Push this folder's **contents** as the repository root. `Dockerfile`, `railway.toml`, `server.mjs`, `package.json`, and `public/` should all be at that root.

Later updates:

```sh
git add .
git commit -m "Update website"
git push
```

## Deploy on Railway

1. Create a Railway project and add a service from your GitHub repository.
2. Select this repository and the `main` branch. If the repository root contains this project's files, leave the service Root Directory unset.
3. Railway can use the included root `Dockerfile`; `railway.toml` declares the Dockerfile builder and `/health` healthcheck. No separate build command or start-command override is needed.
4. The server listens on `0.0.0.0` and uses Railway's `PORT` environment variable automatically. No secrets or custom environment variables are required.
5. After deployment succeeds, open the service's Settings → Networking → Public Networking → Generate Domain.
6. Open the generated HTTPS URL and share it with your colleague. A generated public domain is accessible to anyone who has the URL; this export has no login system.

Railway references:
- Dockerfiles: https://docs.railway.com/builds/dockerfiles
- GitHub deployment updates: https://docs.railway.com/deployments/github-autodeploys
- Public networking: https://docs.railway.com/networking/public-networking

Optional local Docker run:

```sh
docker build -t wou-cybercrime .
docker run --rm -p 3000:3000 -e PORT=3000 wou-cybercrime
```

## Edit the website

| File | Purpose |
| --- | --- |
| `public/index.html` | Homepage |
| `public/about/index.html` | Program overview and videos |
| `public/research/index.html` | Research themes |
| `public/curriculum/index.html` | Degree-plan page |
| `public/projects/index.html` | Attributed CCYBERS projects |
| `public/people/index.html` | Bryce and Omar, program contacts |
| `public/assets/style.css` | All styling and responsive layouts |
| `public/assets/main.js` | Curriculum course data, filters, search, and navigation |
| `public/assets/frontier-*.png` | Three generated homepage illustrations |
| `server.mjs` | Local/Railway static server |

The curriculum is populated from the `groups` array in `public/assets/main.js`. Search suggestions are in its `searchPages` array. The header and footer are present in each page; update them across all six HTML files when changing shared navigation.

## Content and external resources

- WOU program language and logos are retained. This remains a design proposal rather than a change to the official WOU website.
- Research themes are proposed; CCYBERS project descriptions and grant details are attributed to John Jay, not WOU.
- Local assets include WOU faculty photos, imagery, generated illustrations, and fonts. YouTube embeds and external WOU, CCYBERS, Google Slides, and NW3C links require internet access.
- See `ASSET_NOTES.md` and `licenses/` for image and font sources.

## Verification

The Node server was checked locally for all six pages, local assets, directory redirects, HEAD requests, `/health`, missing files, and unsupported methods. ZIP integrity and asset references were checked. Docker/Railway deployment of this export has not been performed, and browser-based visual verification was unavailable during packaging.
