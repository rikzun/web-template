# Web Template

A modern React starter using the latest versions of all key dependencies.

## Performance

This template provides two build system options: [**Webpack**](./webpack) and [**Rspack**](./rspack).

| Action                          | Webpack | Rspack |
|---------------------------------|---------|--------|
| Prod Build (no cache)           | 2848 ms | 570 ms |
| Prod Build (with cache)         | 1795 ms | 171 ms |
| Dev server startup (no cache)   | 2151 ms | 931 ms |
| Dev server startup (with cache) | 776 ms  | 459 ms |
| Hot update                      | 109 ms  | 29 ms  |

> Each value is the median of 20 measurements for each action above.  
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
