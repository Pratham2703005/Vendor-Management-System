# 🚨 Critical React Bug: **React2Shell (CVE-2025-55182)**

## 🧠 Overview

In **late 2025**, a **maximum-severity security vulnerability** was publicly disclosed in **React Server Components** (RSC) that allows **unauthenticated remote code execution (RCE)** on servers using affected React versions. This bug has been dubbed **React2Shell** and carries a **CVSS score of 10.0** — the highest possible severity. :contentReference[oaicite:0]{index=0}

---

## 🚨 What Happened?

- The bug exists in how React **deserializes server-side payloads** sent to React Server Function endpoints. An attacker can send a specially crafted HTTP request that gets deserialized unsafely. This allows execution of arbitrary code on the server **without authentication**. :contentReference[oaicite:1]{index=1}  
- Because React Server Components and Server Functions are used widely (e.g., in frameworks like Next.js), **even default configurations are vulnerable**. :contentReference[oaicite:2]{index=2}  
- A related vulnerability in Next.js was originally tracked as **CVE-2025-66478**, but it has since been merged into CVE-2025-55182 due to the same root cause. :contentReference[oaicite:3]{index=3}

---

## 📦 Affected Versions

The following packages and versions are affected:

### React RSC packages
- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`  
**Versions:** 19.0.0, 19.1.x, 19.2.0 (all vulnerable) :contentReference[oaicite:4]{index=4}

### Next.js
- Next.js **15.x**
- Next.js **16.x**
- Next.js **14.3.0-canary.77+**  
(*Downgrade to stable 14.x if on affected canary*) :contentReference[oaicite:5]{index=5}

> If your project uses React Server Components either directly or through frameworks (e.g., Next.js, React Router, Waku, Redwood, plugins), it may be exposed. :contentReference[oaicite:6]{index=6}

---

## 🛠 Impact

- **Remote Code Execution (RCE):** Attackers can run arbitrary server code. :contentReference[oaicite:7]{index=7}  
- **Unauthenticated Access:** Exploits do not require login or credentials. :contentReference[oaicite:8]{index=8}  
- **Default Apps Vulnerable:** Even newly created apps via tools like `create-next-app` are at risk. :contentReference[oaicite:9]{index=9}

Security researchers noted that **millions of sites** worldwide could have been exposed before patches were applied. :contentReference[oaicite:10]{index=10}

---

## 🚑 Mitigation & Fixes

### ✅ Patching

Upgrade to the **patched versions** immediately:

#### React
- 19.0.1
- 19.1.2
- 19.2.1 (or newer) :contentReference[oaicite:11]{index=11}

#### Next.js
- 15.5.7
- 16.0.7 (stable releases with fixes) :contentReference[oaicite:12]{index=12}

> Always check your dependencies and ensure that RSC-related packages are updated too. :contentReference[oaicite:13]{index=13}

---

## 🧩 Follow-up Vulnerabilities

After the initial disclosure, **additional vulnerabilities** were found in React Server Components:

| CVE | Type | Severity |
|------|------|----------|
| CVE-2025-55184 | Denial of Service (DoS) | High (7.5) |
| CVE-2025-67779 | Additional DoS fix | High (7.5) |
| CVE-2025-55183 | Source Code Exposure | Medium (5.3) | :contentReference[oaicite:14]{index=14} |

These were fixed in **React 19.0.3, 19.1.4, and 19.2.3** and should be updated alongside the critical patch. :contentReference[oaicite:15]{index=15}

---

## 🧠 Lessons for Devs

- Always monitor security advisories for dependencies like React and Next.js.  
- **RSC features are powerful but increase your attack surface** if not managed carefully.  
- Apply patches immediately — RCE vulnerabilities can be exploited in minutes once public.  

---

## 📌 References

- Official React advisory on CVE-2025-55182 and patches. :contentReference[oaicite:16]{index=16}  
- HackerOne analysis of impact and indicators. :contentReference[oaicite:17]{index=17}  
- Government CVE advisory with affected versions & mitigation. :contentReference[oaicite:18]{index=18}  
- Follow-up vulnerabilities disclosed in December 2025. :contentReference[oaicite:19]{index=19}
