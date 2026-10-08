# Academic homepage

A small static site: a header with your photo and contact details, and tabs whose
content is written in Markdown. No build step.

## Editing

| What | Where |
|:--|:--|
| Name, position, contact details, page title | `index.html` (look for `EDIT` comments) |
| Photo | replace `assets/photo.jpeg` |
| Page content | `content/home.md`, `publications.md`, `projects.md`, `teaching.md` |
| Accent colour, width, fonts | variables at the top of `style.css` |

To add a tab, add `<li><a href="#news" data-page="news">News</a></li>` to the nav in
`index.html` and create `content/news.md`.

Two-column Markdown tables render as a date/description timeline and three-column
tables as a course list. LaTeX works via `\\( ... \\)` inline and `$$ ... $$` displayed.

## Preview locally

The pages are fetched by the browser, so opening `index.html` by double-click will
not work. Run a local server instead:

    powershell -ExecutionPolicy Bypass -File serve.ps1

then open http://localhost:8000. (`python -m http.server` works too if you have Python.)

## Publish on GitHub Pages

1. Create a repository on GitHub. Name it `<username>.github.io` to serve the site at
   `https://<username>.github.io/`; any other name serves it at
   `https://<username>.github.io/<repo>/`.
2. Push this folder:

       git init -b main
       git add .
       git commit -m "Initial site"
       git remote add origin https://github.com/<username>/<repo>.git
       git push -u origin main

3. On GitHub: Settings → Pages → Source "Deploy from a branch", branch `main`, folder `/ (root)`.

The site is live a minute or so later; each later push updates it.
