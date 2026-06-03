# Web Template

A modern React starter using the latest versions of all key dependencies.

## Performance

This template provides two build system options: [**Webpack**](./webpack) and [**Rspack**](./rspack).

| Action                          | Webpack | Rspack  |
|---------------------------------|---------|---------|
| Prod Build (no cache)           | 3347 ms | 1334 ms |
| Prod Build (with cache)         | 1118 ms | 379 ms  |
| Dev server startup (no cache)   | 2238 ms | 1274 ms |
| Dev server startup (with cache) | 2239 ms | 368 ms  |
| Hot update                      | 95 ms   | 13 ms   |

> Each value is the median of 100 measurements for each action above.  
> In practice, **Rspack** is preferred as it is consistently faster.

**Test machine:**
- **CPU:** Intel Core i7-11370H
- **RAM:** 32GB DDR4 SDRAM
- **SSD:** Samsung 970 EVO Plus NVMe
- **OS:** Windows 11 Pro, version 24H2
- **Node.js:** v22.16.0

## Notes

- Use absolute imports via aliases like `@assets`, `@components`, `@utils`, etc.
- Place static files and favicons in the `public` directory.
- Edit `public/index.html` before you begin development.
- By default, `public/robots.txt` is set to disallow all bots.

---

**Found a bug or have a suggestion?**  
Feel free to [open an issue](../../issues) or a pull request!
