# Student-Crud-SpringBoot

A simple REST API built with **Spring Boot** for managing student records. It supports full CRUD operations (Create, Read, Update, Partial Update, Delete), request validation, and centralized exception handling.

## Features

- Create, retrieve, update, partially update, and delete students
- Automatic age calculation from date of birth
- Bean validation on incoming requests (name format, email format, past date of birth, required fields)
- Duplicate email prevention
- Centralized, consistent JSON error responses via `@RestControllerAdvice`
- Partial updates (`PATCH`) that only touch the fields provided

## Tech Stack

- Java
- Spring Boot
- Spring Web (REST controllers)
- Spring Data JPA
- Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Pattern`, `@Past`, etc.)
- Lombok
- Relational database via JPA (e.g. PostgreSQL/H2 — configurable through `application.properties`)

## Project Structure

```
com.example.demo.student
├── domain
│   ├── Student.java              # JPA entity
│   └── Gender.java                # Enum: MALE, FEMALE
├── repository
│   └── StudentRepository.java     # Spring Data JPA repository
├── request
│   └── StudentRequest.java        # DTO for create/update (all fields required)
├── patchrequest
│   └── StudentPatchRequest.java   # DTO for partial update (all fields optional)
├── response
│   └── StudentResponse.java       # DTO returned to clients (includes computed age)
├── service
│   └── StudentService.java        # Business logic
├── controller
│   └── StudentController.java     # REST endpoints
├── exception
│   ├── StudentNotFoundException.java
│   ├── EmailAlreadyTakenException.java
│   └── GlobalExceptionHandler.java
└── configuration
    └── StudentConfig.java         # (optional) sample data seeder via CommandLineRunner
```

## API Endpoints

Base path: `/api/students`

| Method | Endpoint                | Description                          |
|--------|--------------------------|---------------------------------------|
| GET    | `/api/students`          | Get all students                      |
| POST   | `/api/students`          | Create a new student                  |
| PUT    | `/api/students/{id}`     | Fully update an existing student      |
| PATCH  | `/api/students/{id}`     | Partially update an existing student  |
| DELETE | `/api/students/{id}`     | Delete a student by id                |
| DELETE | `/api/students`          | Delete all students                   |

### Request Body — `POST` / `PUT`

```json
{
  "name": "Hamdy Tamer",
  "email": "hamdy123@gmail.com",
  "dob": "2004-08-29",
  "gender": "MALE"
}
```

Validation rules:
- `name`: required, 3–15 characters, must start with a capital letter, letters only (spaces allowed between capitalized words)
- `email`: required, must contain at least one digit before the `@` and match a valid email pattern
- `dob`: required, must be a date in the past
- `gender`: required, must be `MALE` or `FEMALE`

### Request Body — `PATCH`

All fields are optional; only provided fields are updated.

```json
{
  "email": "newemail123@gmail.com"
}
```

### Example Response

```json
{
  "id": 1,
  "name": "Hamdy Tamer",
  "email": "hamdy123@gmail.com",
  "gender": "MALE",
  "dob": "2004-08-29",
  "age": 22
}
```

## Error Handling

Errors are returned as structured JSON via a global exception handler.

**404 — Student not found**
```json
{
  "timestamp": "2026-09-13T10:15:30Z",
  "status": 404,
  "error": "Not Found",
  "message": "Student with id 5 not found",
  "path": "/api/students/5"
}
```

**400 — Email already taken**
```json
{
  "timestamp": "2026-09-13T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Email hamdy123@gmail.com is already taken",
  "path": "/api/students"
}
```

**400 — Validation failure**
```json
{
  "timestamp": "2026-09-13T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/students",
  "fieldErrors": {
    "email": "Invalid email format",
    "name": "Name must start with capital letter and contain only valid names"
  }
}
```

**400 — Malformed JSON / invalid enum**
```json
{
  "timestamp": "2026-09-13T10:15:30Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Gender must be either MALE or FEMALE",
  "path": "/api/students"
}
```

## Getting Started

### Prerequisites
- Java 17+
- Maven or Gradle
- A configured database connection in `src/main/resources/application.properties` (or `application.yml`)

### Run the application

```bash
# Using Maven
./mvnw spring-boot:run

# Using Gradle
./gradlew bootRun
```

The API will be available at `http://localhost:8080/api/students`.

### Sample data

`StudentConfig.java` contains a commented-out `CommandLineRunner` bean that seeds the database with a few sample students on startup. Uncomment it if you'd like the app to start with sample data.

## Example cURL Requests

```bash
# Get all students
curl http://localhost:8080/api/students

# Create a student
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Farah Ahmed","email":"farah123@gmail.com","dob":"2001-05-07","gender":"FEMALE"}'

# Update a student
curl -X PUT http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Farah Ahmed","email":"farah456@gmail.com","dob":"2001-05-07","gender":"FEMALE"}'

# Partially update a student
curl -X PATCH http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"farah789@gmail.com"}'

# Delete a student
curl -X DELETE http://localhost:8080/api/students/1

# Delete all students
curl -X DELETE http://localhost:8080/api/students
```

## License

This project is open source and available for personal or educational use.
