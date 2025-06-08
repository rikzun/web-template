# My Alternative to Create React App

A modern React starter using the latest versions of all key dependencies.

## Performance (on my machine)

- **Build (no cache):** ~1798ms
- **Build (with cache):** ~1646ms
- **Dev server startup (no cache):** ~1920ms
- **Dev server startup (with cache):** ~722ms
- **Hot update:** ~94ms

*Each value is the median of 20 measurements for each item above.*

## Notes

- All main configuration is in `webpack.config.js` and can be easily tweaked.
- Use absolute imports via aliases like `@assets`, `@components`, `@utils`, etc.
- Place static files and favicons in `public`.
- Edit `public/index.html` before you begin development.
- By default, `public/robots.txt` is set to disallow all bots.

---

**Found a bug or have a suggestion?**  
Feel free to [open an issue](../../issues) or a pull request!