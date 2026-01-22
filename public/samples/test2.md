# Next.js 16: Major Release Overview

Next.js 16 focuses on performance, developer experience, and clearer APIs. It makes **Turbopack** the default bundler, introduces **Cache Components**, and integrates fully with **React 19.2**.

---

## 🚀 Performance & Developer Experience

* **Turbopack as Default Bundler:** Turbopack is now stable and the default for all apps.
    * **2-5x faster** production builds.
    * Up to **10x faster** Fast Refresh in development.
* **React Compiler Support (Stable):** Built-in support for the React Compiler (v1.0) allows for automatic component memoization, reducing unnecessary re-renders without manual `useMemo` or `useCallback`. (Must be explicitly enabled).
* **Improved Logging:** Development request logs and build outputs now provide detailed metrics on where time is spent (**compile vs. render**).
* **Simplified `create-next-app`:** The setup flow uses App Router, TypeScript, Tailwind CSS, and ESLint by default.

---

## 💾 Caching & Data Fetching

### Cache Components
A new programming model using the `use cache` directive to provide explicit, opt-in control over server-side caching for pages, components, and functions. 

### Enhanced Caching APIs
| API | Description |
| :--- | :--- |
| **`revalidateTag(tag, profile)`** | Now requires a `cacheLife` profile (e.g., 'max', 'hours') for stale-while-revalidate behavior. |
| **`updateTag(tag)`** | New Server Actions API for "read-your-writes" consistency. |
| **`refresh()`** | Helps update uncached data (like notification counts) within Server Actions. |

> **Note:** Accessing `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` is now **asynchronous** and requires `await`.

---

## 🛣️ Routing & APIs

* **`proxy.ts` Replaces `middleware.ts`:** Renamed to better clarify its role as a request interception layer running in the Node.js runtime.
* **Enhanced Routing:** Optimizations like layout deduplication and incremental prefetching significantly reduce network transfer sizes.
* **React 19.2 Integration:** * **View Transitions API** for smoother animations.
    * `useEffectEvent()` hook.
    * `<Activity/>` component support.

---

## 🛠️ Migration & Requirements

* **Minimum Requirements:** Node.js 20.9+ and TypeScript 5.1+.
* **Removals:** * AMP support.
    * `next lint` command (use ESLint directly).
    * Runtime configurations.
* **Upgrade Tools:** Vercel provides **codemods** to automate the migration of deprecated APIs.

---

For detailed documentation and upgrade guides, visit the [official Next.js documentation](https://nextjs.org/docs).