# Images needed for the site

Put your images in this `images/` folder, then replace the placeholder boxes
(`<div class="img-ph">...</div>`) in the HTML with a real image tag, e.g.:

```html
<img src="images/logo.png" alt="DTecBiz 2026 logo">
```

For the hero banner (index.html), instead set the photo as the background of the
`.hero` section in `css/style.css`:

```css
.hero {
    background:
        linear-gradient(rgba(10, 40, 27, .78), rgba(10, 40, 27, .78)),
        url("../images/hero.jpg") center / cover no-repeat;
}
```
(and delete the `.hero-bg-note` span in index.html)

## Image slots by page

| Page | Slot | Suggested size |
|---|---|---|
| All pages | DTecBiz 2026 logo (header + footer) | ~200x200 px, transparent PNG |
| All pages | SLIIT Kandy UNI logo (optional, in footer) | ~200x200 px, transparent PNG |
| index.html | Hero background photo | 1920x900 px |
| index.html | Welcome section photo | 800x600 px |
| index.html | Proceedings / abstract book cover | 400x550 px |
| index.html | Abstract template cover | 400x550 px |
| index.html + call-for-papers.html | Scan-for-template QR code | 400x400 px |
| keynotes.html | Keynote speaker & chief guest photos | 400x400 px each |
| gallery.html | Event photos | 800x600 px each |
| venue.html | Sri Lanka, Kandy, SLIIT Kandy UNI campus photos | 800x600 px each |
| venue.html + contact-us.html | Google Maps embed (iframe) | full width |
| contact-us.html | Chair & Secretary photos | 400x400 px each |
