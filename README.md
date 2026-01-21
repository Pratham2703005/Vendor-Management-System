# Aura VMS

A tiny, premium-designed service for writers to submit documents for manager approval. Built with Next.js 16, TypeScript, and SQLite.

## Features
*   **Document Parsing**: Automatically extracts Title, Content, and Image References from `.docx`, `.md`, and `.txt` files.
*   **Role-Based Access**: Specialized dashboards for `writer` (Upload/Preview) and `manager` (Approve/Reject).
*   **Email Workflow**: Automated email notifications with actionable "Approve/Reject" links (Mocked/Logged if SMTP not configured).
*   **Premium UI**: Glassmorphism aesthetic, dark mode, and responsive design using Tailwind CSS v4.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Server**:
    ```bash
    npm run dev
    ```

3.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000)

4.  **Login**:
    *   **Writer**: Use ID `writer`
    *   **Manager**: Use ID `manager`

## Development
*   **Run Tests**: `npm test`
*   **Database**: Uses `better-sqlite3`. Database file `aura.db` is created automatically in the root.

## Architecture Decisions
*   **Unified Next.js App**: Used App Router for both UI and API to keep the deployment simple and "tiny".
*   **SQLite**: Chosen for the simpler "No heavy database" requirement while providing standard SQL benefits (types, constraints) over a raw JSON file.
*   **Hexagonal-style Logic**: Core logic (Parsing, Emailing, DB access) is separated in `lib/` to allow for easy unit testing and separation of concerns.

## Future Constraints / Improvements
*   **Authentication**: Currently uses a simple cookie-based role check. Real production apps should use Auth.js or similar.
*   **Image Handling**: Currently extracts image references/links. For a real production app, I would implement full image extraction to cloud storage (e.g., S3/Uploadthing).
*   **Error Handling**: Basic toasts and alerts are implemented; a global error boundary would be better.

## Project Structure
*   `app/`: Routes and Pages (Login, Dashboard, API)
*   `lib/`: Core Logic (DB, Parser, Email)
*   `__tests__/`: Unit Tests
