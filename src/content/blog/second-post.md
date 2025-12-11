---
title: "Mastering CSS Variables for Dark Mode"
description: "Learn how to implement a robust dark mode system using nothing but Vanilla CSS and CSS Custom Properties."
pubDate: 2024-03-20
image: "/images/dark-mode.jpg"
tags: ["CSS", "Design", "Tutorial"]
---

# Dark Mode Done Right

Implementing dark mode used to be a hassle. Classes toggling, flash of unstyled content (FOUC), complex overrides. But with modern CSS, it's a breeze.

## The Power of CSS Variables

By defining your colors as variables, you can switch themes by simply changing the values of those variables within a media query or a class.

```css
:root {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
}

[data-theme="dark"] {
  --bg-color: #09090b;
  --text-color: #f4f4f5;
}
```

## Considerations for Accessibility

Dark mode isn't just about inverting colors. You need to consider:

- **Contrast Ratios**: Ensure text is readable.
- **Desaturation**: Avoid fully saturated colors on dark backgrounds to prevent eye strain.
- **Images**: Consider lowering the brightness of images in dark mode.

## Summary

CSS variables make theming powerful and maintainable. Embrace them!
