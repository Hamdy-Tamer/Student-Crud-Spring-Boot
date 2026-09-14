# Student-Crud-Spring-Boot

A simple RESTful CRUD API for managing student records, built with **Spring Boot**, **Spring Data JPA**, and **Bean Validation**. It supports creating, reading, fully updating, partially updating, and deleting students, with centralized exception handling and clean layered architecture.

## Features

- Full CRUD operations for student records
- Partial updates via `PATCH`
- Bean validation on incoming requests (name format, email format, date of birth, gender)
- Duplicate email prevention
- Centralized exception handling with consistent JSON error responses
- Computed `age` field derived from date of birth
- Optional data seeding via `CommandLineRunner`

## Tech Stack

- Java
- Spring Boot
- Spring Web (REST controllers)
- Spring Data JPA
- Jakarta Bean Validation (`jakarta.validation`)
- Lombok
- Relational database (via Spring Data JPA / JPA sequence generator)

## Project Structure

```
com.example.demo.student
├── configuration
│   └── StudentConfig.java          # Optional CommandLineRunner for seeding sample data
├── controller
│   └── StudentController.java      # REST endpoints
├── domain
│   ├── Student.java                # JPA entity
│   └── Gender.java                 # Gender enum (MALE, FEMALE)
├── exception
│   ├── EmailAlreadyTakenException.java
│   ├── StudentNotFoundException.java
│   └── GlobalExceptionHandler.java # Centralized error handling
├── patchrequest
│   └── StudentPatchRequest.java    # DTO for partial updates
├── repository
│   └── StudentRepository.java      # Spring Data JPA repository
├── request
│   └── StudentRequest.java         # DTO for create/update requests
├── response
│   └── StudentResponse.java        # DTO for API responses
└── service
    └── StudentService.java         # Business logic
```

## Data Model

### Student

| Field  | Type        | Notes                                  |
|--------|-------------|-----------------------------------------|
| id     | Long        | Auto-generated (sequence)              |
| name   | String      | Full name                              |
| email  | String      | Unique                                 |
| gender | Gender      | `MALE` or `FEMALE`                     |
| dob    | LocalDate   | Date of birth                          |
| age    | Integer     | Computed at response time, not stored  |

## API Endpoints

| Method | Endpoint                  | Description                       | Body                  |
|--------|----------------------------|------------------------------------|------------------------|
| GET    | `/api/students`            | Get all students                   | —                      |
| POST   | `/api/students`             | Create a new student                | `StudentRequest`       |
| PUT    | `/api/students/{studentId}` | Fully update an existing student   | `StudentRequest`       |
| PATCH  | `/api/students/{studentId}` | Partially update an existing student | `StudentPatchRequest` |
| DELETE | `/api/students/{studentId}` | Delete a student by id             | —                      |
| DELETE | `/api/students`             | Delete all students                 | —                      |

### Example: Create a Student

**Request**
```http
POST /api/students
Content-Type: application/json

{
  "name": "Hamdy Tamer",
  "email": "hamdytamer253@gmail.com",
  "gender": "MALE",
  "dob": "2004-08-29"
}
```

**Response** — `201 Created`
```json
{
  "id": 1,
  "name": "Hamdy Tamer",
  "email": "hamdytamer253@gmail.com",
  "gender": "MALE",
  "dob": "2004-08-29",
  "age": 22
}
```

### Example: Partially Update a Student

**Request**
```http
PATCH /api/students/1
Content-Type: application/json

{
  "email": "newemail123@gmail.com"
}
```

Only the fields provided in the request body are updated; all other fields remain unchanged.

## Validation Rules

- **name**: must start with a capital letter, contain only letters and single spaces between words, and be 3–15 characters long.
- **email**: must match a standard email pattern (local part + digits + domain).
- **dob**: must be a date in the past.
- **gender**: required on creation (`MALE` or `FEMALE`); optional on partial update.

On `POST` and `PUT`, all fields are required. On `PATCH`, all fields are optional, but any field provided must still pass its validation rule.

## Error Handling

All errors are returned in a consistent JSON shape:

```json
{
  "timestamp": "2026-09-13T12:34:56Z",
  "status": 404,
  "error": "Not Found",
  "message": "Student with id 5 not found",
  "path": "/api/students/5"
}
```

| Scenario                          | Status | Handled By                          |
|------------------------------------|--------|---------------------------------------|
| Student not found                  | 404    | `StudentNotFoundException`            |
| Email already taken                | 400    | `EmailAlreadyTakenException`          |
| Malformed JSON / invalid enum value| 400    | `HttpMessageNotReadableException`     |
| Bean validation failure (`@Valid`) | 400    | `MethodArgumentNotValidException`     |

Validation failures also include a `fieldErrors` map listing which fields failed and why.

## Getting Started

### Prerequisites

- JDK 17+
- Maven or Gradle
- A configured database connection (e.g. PostgreSQL/MySQL) in `application.properties` / `application.yml`

### Run the Application

```bash
# Using Maven
./mvnw spring-boot:run

# Using Gradle
./gradlew bootRun
```

The API will be available at `http://localhost:8080/api/students`.

### Seeding Sample Data (optional)

`StudentConfig.java` contains a commented-out `CommandLineRunner` bean that seeds three sample students on startup. Uncomment it and remove the surrounding comment block to enable it.

## License

This project is open source and available for personal or educational use.
