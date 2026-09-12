# Springnexa Private Limited — Website

A static 4-page site — Home, About, Divisions (Healthcare / IT / Social Welfare), Contact. Plain HTML/CSS, no build step required.

## Deploy via Cloudflare Pages (Git-connected)

1. **Create a Git repo** (GitHub or GitLab) and push these files to it:
   ```
   git init
   git add .
   git commit -m "Initial Springnexa site"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect it in Cloudflare:**
   - Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
   - Authorize access to your GitHub/GitLab account and pick this repo

3. **Build settings** (plain static site):
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`

4. **Deploy.** You get a `*.pages.dev` URL immediately.

5. **Connect your real domain** under **Custom domains** in the Pages project once the domain is on Cloudflare.

Every `git push` to `main` auto-deploys after this — no manual upload needed.

## What still needs real content before going live

- **Contact details** — email and phone are placeholders (`info@springnexa.in`, `+91 00000 00000`). The registered office address is the real one from MCA records; double-check it's still current.
- **Healthcare division** — service list on the Divisions page is a placeholder; add your actual diagnostic services, training programs, and any accreditation/certification details.
- **Social Welfare division** — currently a placeholder; add your actual programs.
- **Contact form** — static, no backend. Wire it to [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) or a service like Formspree to receive submissions.
- Consider whether you want director names, team bios, or a founding story on the About page.
