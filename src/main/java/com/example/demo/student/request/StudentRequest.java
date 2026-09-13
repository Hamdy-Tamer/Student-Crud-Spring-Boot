package com.example.demo.student.request;

import com.example.demo.student.domain.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record StudentRequest(

        @NotBlank(message = "Name is required")
        @Pattern(
                regexp = "^(?=^.{3,15}$)[A-Z][a-z]*(\\s[A-Z][a-z]*)*$",
                message = "Name must start with capital letter and contain only valid names"
        )
        String name,

        @NotBlank(message = "Email is required")
        @Pattern(
                regexp = "^[a-zA-Z._%+-]+[0-9]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,3}$",
                message = "Invalid email format"
        )
        String email,

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dob,

        @NotNull(message = "Gender is required")
        Gender gender
) {
}