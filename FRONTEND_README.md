# Frontend Development Guide

This document outlines the frontend architecture, page structures, and API integrations necessary to build a graphical user interface (GUI) for the media sharing platform based on the existing backend microservices.

## 🌟 Overview
The platform allows users to register, upload media assets, view their media, and share those assets securely with other users via email using generated share tokens. All API requests must be routed through the API Gateway (`http://localhost:8080`).

---

## 🏗️ Architecture & Tech Stack Recommendations
* **Framework:** React / Next.js / Vue.js
* **State Management:** Redux / Zustand / or React Context for managing the `User Profile` and `JWT Token`.
* **Styling:** Tailwind CSS or Material-UI for rapid UI development.
* **HTTP Client:** Axios or Fetch API. Important: Include an interceptor to attach the `Authorization: Bearer <token>` to **every request** except Login/Register.
* **Routing:** React Router (if using React) or Vue Router.

---

## 🔒 Authentication Flow
1. User logs in via `POST /auth/login`.
2. Response contains a JWT token.
3. Save the token in `localStorage` or `sessionStorage`.
4. Add the token to the `Authorization` header as `Bearer <token>` for all subsequent operations.

---

## 🗺️ Application Pages and Routes

### 1. Auth / Landing Page (`/login` and `/register`)
**Purpose:** Entry point for users to authenticate.
**Components:**
* **Login Form:** Inputs for `username` and `password`.
* **Registration Form:** Inputs for `username`, `email`, and `password`.
**API Integrations:**
* `POST /auth/login` (Body: `{ "username", "password" }`)
* `POST /auth/register` (Body: `{ "username", "email", "password" }`)

### 2. Dashboard / User Home (`/dashboard`)
**Purpose:** A central hub showing the user's statistics, profile details, and recent activities.
**Components:**
* **Sidebar / Navbar:** Links to Dashboard, My Media, My Shares, and Shared With Me. Logout button.
* **Profile Widget:** Shows logged-in user details.
* **Quick Actions:** "Upload New File", "Share a File" buttons.
**API Integrations:**
* `GET /users/profile` -> Fetches user info to display username and email.

### 3. Media Library (`/media`)
**Purpose:** View and upload media files.
**Components:**
* **Upload Section:** A drag-and-drop zone or a file picker.
* **Media Grid/List:** Displays cards for each uploaded media item.
* **Media Card Actions:** "View Details", "Share".
**API Integrations:**
* `GET /media/user/all` -> Retrieves an array of the user's uploaded assets.
* `POST /media/upload` -> A multipart/form-data request containing the binary `file`.

### 4. Sharing Management (`/shares`)
**Purpose:** Track what the user has shared and what has been shared with them.
**Components:**
* **Tabs / Sections:** "My Shares" (Items I shared) vs "Shared With Me" (Items others sent me).
* **Lists:** Table displaying the media ID, target user email, access type (e.g., READ), and Share Token.
**API Integrations:**
* `GET /sharing/my-shares` -> Retrieves items the user has shared.
* `GET /sharing/shared-with-me` -> Retrieves items others have shared with this user.

### 5. Media Details & Share Modal
**Purpose:** Popup or dedicated page for a single media asset to initiate the share process.
**Components:**
* **Media Details Viewer:** Displays the file properties.
* **Share Form:** Input for `recipientEmail` and a "Share" button.
**API Integrations:**
* `GET /media/{id}` -> Fetches details of the specific media asset.
* `POST /sharing/share` -> Creates the share link. (Body: `{ "mediaId": 123, "recipientEmail": "user@example.com" }`).

### 6. Public / Token Access Page (`/shared/:token`)
**Purpose:** Resolving a shared item using the token.
**Components:**
* **Share Viewer:** Shows details of the shared media based on the token.
**API Integrations:**
* `GET /sharing/access/{token}` -> Validates the token and retrieves the `Share` details. Depending on implementation, you can then fetch the actual media binary if the backend provides a download endpoint.

---

## 📡 API Reference Summary (Gateway: `http://localhost:8080`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| **POST** | `/auth/login` | No | Authenticate and retrieve JWT. |
| **POST** | `/auth/register` | No | Create a new user account. |
| **GET**  | `/users/profile`| Yes | Get current user's details. |
| **POST** | `/media/upload` | Yes | Upload multipart file (Key: `file`). |
| **GET**  | `/media/{id}` | Yes | Get details of a specific media file. |
| **GET**  | `/media/user/all` | Yes | Get all media owned by current user. |
| **POST** | `/sharing/share` | Yes | Share media (Body: `mediaId`, `recipientEmail`). |
| **GET**  | `/sharing/access/{token}` | Yes/No* | View a shared media item via token. |
| **GET**  | `/sharing/my-shares` | Yes | List items the current user has shared out. |
| **GET**  | `/sharing/shared-with-me` | Yes | List items shared with the current user. |

*(Note: Gateway filters currently enforce JWT on `/sharing/**` paths. To make the `/access/{token}` fully public, the Gateway predicate in `api-gateway/src/main/resources/application.yml` would need to bypass the `AuthenticationFilter` for that specific sub-path, otherwise require the user to be logged in to view shared items).*

---

## 🎨 Future Polish: Detailed Modern UI/UX Design System

When preparing for the v2 Polish phase, use the following blueprint to turn the basic scaffolding into a premium, modern web application.

### 🎯 Theme & Styling Guidelines
*   **CSS Framework:** Integrate **Tailwind CSS** combined with **shadcn/ui** or **Radix UI** for highly accessible, unstyled, yet gorgeous component primitives.
*   **Color Palette:**
    *   *Primary:* Blue/Indigo gradient (e.g., Tailwind `bg-blue-600` to `indigo-600`).
    *   *Background:* Soft light mode (`bg-slate-50`), deep contrast dark mode (`bg-slate-900`).
    *   *Surfaces:* White (`bg-white`) with subtle borders (`border-slate-200`) and soft shadows (`shadow-sm` / `shadow-md`).
    *   *Text:* Slate-800 for primary headings, Slate-500 for secondary text.
*   **Typography:** Use modern variable fonts like **Inter** or **Geist** for crisp readability.
*   **Animations:** Use **Framer Motion** for silky smooth element enter/exit animations, hover states, and modal popups.

### 🖥️ Page-by-Page High-Fidelity Specs

#### 1. Global Layout & Navigation (Navbar)
*   **Design:** A floating "glassmorphism" top navigation bar (`backdrop-blur-md bg-white/70`).
*   **UX Features:**
    *   **Logo:** A sleek, colorful logo or typographic lockup on the left.
    *   **Links:** Smooth, animated sliding underline on hover.
    *   **Avatar:** An auto-generated user avatar circle (e.g., using user's initials) with a dropdown menu linking to "Profile settings" and "Logout".

#### 2. Authentication (Login & Register)
*   **Design:** Split-screen layout. Left side: High-quality abstract illustration or gradient mesh. Right side: The login/register form centered vertically & horizontally.
*   **UX Features:**
    *   Floating label inputs.
    *   "Show/Hide Password" toggle eye icon.
    *   Subtle pulse animation on the "primary action" button (e.g., "Sign In").
    *   Clear, inline form validation error messages in red with small alert icons.

#### 3. Dashboard (`/dashboard`)
*   **Design:** A clean dashboard grid layout using CSS Grid. 
*   **UX Features:**
    *   **Welcome Banner:** "Welcome back, {Username} 👋" utilizing a light gradient background.
    *   **Stat Cards:** 3 clean metric cards at the top displaying "Total Uploads", "Total Shares Sent", "Total Received". (Icons, big numbers, small trend lines).
    *   **Recent Activity Feed:** A sleek vertical timeline showing the last 5 files uploaded or shared, styled with small thumbnails and timestamps (e.g., "2 hours ago").
    *   **Empty States:** If the user is new, show a beautiful illustration with a prominent "Upload Your First File" CTA button.

#### 4. Media Library (`/media`)
*   **Design:** Masonry or responsive css-grid layout for files.
*   **UX Features:**
    *   **Hero Dropzone:** A large, prominent dashed-border area at the top that reads "Drag & Drop files here, or click to browse". When a file is dragged over, the zone glows blue and scales up slightly.
    *   **Upload Progress:** A sleek inline progress bar (0% to 100%) showing upload status.
    *   **Media Cards:** Instead of list text, render files as sleek "Cards". If it's an image, render a thumbnail preview. If a document, show a stylish document icon.
    *   **Overlay Actions:** When hovering over a media card, slide up a semi-transparent overlay with modern circular action buttons: **[ Share ]**, **[ Download ]**, **[ Delete ]**.

#### 5. Sharing Center (`/shares`)
*   **Design:** A clean, tabbed interface using customized tabs (e.g., Radix Tabs) enabling the user to switch seamlessly between "My Shares" and "Shared With Me" without page reloads.
*   **UX Features:**
    *   **Data Table:** Replace bulleted lists with a professional Data Table. Columns: Preview, Target Email, Access Type, Date Shared, Controls.
    *   **Token interaction:** Mask the long token and display a small, elegant clipboard icon next to it. Clicking it flashes "Copied!" via a toast notification.
    *   **Revoke Access:** A red trash-can icon on hover to quickly kill a shared link.

#### 6. Share Creation Flow (Modal)
*   **Design:** Instead of an inline form, clicking "Share" on any file should trigger a centralized screen-darkening Modal.
*   **UX Features:**
    *   **Left column within modal:** Details of the file being shared (File name, size, type).
    *   **Right column:** A clean input for the recipient's email, and a dropdown for `Access Type` (Read/Write).
    *   **Success state:** Instead of `alert()`, upon success, the modal switches to a "Success Checkmark" animation and presents the generated share link for easy copying.

#### 7. General Error Handling
*   **Design:** Replace native browser `alert()` popups entirely.
*   **UX Features:** Integrate **React Hot Toast** or **Sonner**. Any error (Network, 403, 500) subtly slides in a styled notification card at the bottom right of the screen (red for error, green for success) which auto-dismisses after 3 seconds.
