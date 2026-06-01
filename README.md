# Distributed Smart Media Processing & Sharing Platform - Implementation Blueprint

This document serves as the master implementation plan and technical blueprint for the platform. It outlines specific steps, architectures, and implementation details for each phase of the project.

## 👥 Team & Responsibilities
- **Yeabsira Belete**: `auth-service` (Security & User Identity)
- **Yeabsira Ayele**: `media-service` (Uploads & Processing Engine)
- **Yafet Mickael**: `sharing-service` (Permission Logic & Distribution)

---

## 🛠️ Phase 1: Foundation & Shared Components (`common-lib`)
*Goal: Ensure all services speak the same "language" via standardized DTOs.*

1.  **Standardized API Response**:
    -   Implement `ApiResponse<T>` with fields: `success`, `message`, `data`, and `timestamp`.
    -   Include static factory methods: `.success()`, `.error()`.
2.  **Global Constants**:
    -   Centralize role names (`ROLE_USER`, `ROLE_ADMIN`).
    -   Define standard header names for Auth (e.g., `X-Auth-User-Id`).
3.  **Custom Exceptions**:
    -   Create `PlatformException` and sub-exceptions like `ResourceNotFoundException`.

---

## 🔐 Phase 2: Authentication & User Service (`auth-service`)
*Goal: Provide secure access via JWT and manage user profiles.*

1.  **Database & Entity Modeling**:
    -   `User` Entity: `id`, `username`, `password` (hashed), `email`, `role`.
2.  **Security Configuration**:
    -   Configure `BCryptPasswordEncoder` for secure storage.
    -   Implement `UserDetailsService` to load users from DB.
3.  **JWT Engine**:
    -   `JwtService`: Methods for `generateToken`, `validateToken`, and `extractUsername`.
    -   `JwtFilter`: Intercept requests to validate tokens before hitting controllers.
4.  **API Implementation**:
    -   `POST /auth/register`: Validate email uniqueness, hash password, save user.
    -   `POST /auth/login`: Authenticate credentials, return `AuthResponse` with token.
    -   `GET /users/profile`: Return current logged-in user details.

---

## 📦 Phase 3: Media Upload & Processing Service (`media-service`)
*Goal: Handle high-volume file uploads and transform media assets.*

1.  **File Storage Infrastructure**:
    -   Implement `FileSystemStorageService`: Manage local directories for `original/` and `processed/`.
    -   Configure `max-file-size` and `allowed-types` in `application.yml`.
2.  **Core Processing Logic**:
    -   **Images**: Use `Java ImageIO` for resizing and `Thumbnailator` for compression.
    -   **Videos**: Integrate `FFmpeg` wrapper to generate video thumbnails.
3.  **Asynchronous Handling**:
    -   Use Spring `@Async` to process media in the background so the user doesn't wait for resizing.
4.  **API Implementation**:
    -   `POST /media/upload`: Accept `MultipartFile`, save original, trigger async process.
    -   `GET /media/{mediaId}`: Stream file content to the user.
    -   `DELETE /media/{mediaId}`: Clean up files from disk and DB record.

---

## 🌐 Phase 4: Sharing & Distribution Service (`sharing-service`)
*Goal: Manage access control and generate shareable links.*

1.  **Sharing Model**:
    -   `Share` Entity: `id`, `mediaId`, `ownerId`, `targetUserId` (null for public), `accessType` (READ/EDIT), `expiryDate`.
2.  **Access Control Logic**:
    -   Implement checks: "Does this user have permission to view this media?".
3.  **Link Generation**:
    -   Generate unique UUID-based share tokens for public links.
4.  **API Implementation**:
    -   `POST /share`: Create a new sharing record.
    -   `GET /shared/{token}`: Retrieve media details via share token.
    -   `GET /user/shared-with-me`: List media shared specifically with the current user.

---

## 🔗 Phase 5: Integration & Routing (`api-gateway`)
*Goal: Unify the services into a single system.*

1.  **Routing Configuration**:
    -   Map routes: `/auth/**`, `/media/**`, `/share/**`.
2.  **Global Authentication Filter**:
    -   Implement a gateway filter that validates the JWT once and injects user info into headers for downstream services.
3.  **CORS & Error Handling**:
    -   Configure global CORS to allow frontend access.
    -   Provide a fallback error response if a service is down.

---

## 🧪 Phase 6: Testing & Verification
1.  **Unit Tests**: Mockito for service layer logic.
2.  **Postman Collection**: Create automated scripts to test the full flow:
    -   Register -> Login -> Extract Token.
    -   Upload Image -> Get Media ID.
    -   Share Media -> Get Share Token.
    -   Access via Share Token.

---

## 🗓️ Execution Roadmap
1.  **Step 1**: Complete `common-lib` (DTOs & Exceptions).
2.  **Step 2**: Deploy `auth-service` (The backbone of security).
3.  **Step 3**: Deploy `media-service` (Core functionality).
4.  **Step 4**: Deploy `sharing-service` (The social/sharing layer).
5.  **Step 5**: Finalize `api-gateway` and End-to-End testing.

# How to run the code

## Run the frontend

1. cd c:\Users\YEABSIRA BELETE\OneDrive\Documents\Codes\java_group\java_group\frontend
2. npm install
3. npm run dev

## Run the backend 

1. Build the Java backend
    -> cd c:\Users\YEABSIRA BELETE\OneDrive\Documents\Codes\java_group\java_group
    -> mvn clean install

2. Start the backend services
    ### Run each service in its own terminal:
    -> cd c:\Users\YEABSIRA BELETE\OneDrive\Documents\Codes\java_group\java_group\auth-service
    -> mvn spring-boot:run

    -> cd c:\Users\YEABSIRA BELETE\OneDrive\Documents\Codes\java_group\java_group\media-service
    -> mvn spring-boot:run

    -> cd c:\Users\YEABSIRA BELETE\OneDrive\Documents\Codes\java_group\java_group\sharing-service
    -> mvn spring-boot:run

    ### Then start the gateway:
    -> cd c:\Users\YEABSIRA BELETE\OneDrive\Documents\Codes\java_group\java_group\api-gateway
    -> mvn spring-boot:run