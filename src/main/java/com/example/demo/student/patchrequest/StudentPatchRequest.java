package com.example.demo.student.patchrequest;

import com.example.demo.student.domain.Gender;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record StudentPatchRequest(
        @Pattern(
                regexp = "^(?=^.{3,15}$)[A-Z][a-z]*(\\s[A-Z][a-z]*)*$",
                message = "Name must start with capital letter and contain only letters"
        )
        String name,

        @Pattern(
                regexp = "^[a-zA-Z._%+-]+[0-9]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,3}$",
                message = "Invalid email format"
        )
        String email,

        @Past(message = "Date of birth must be in the past")
        LocalDate dob,

        Gender gender
) {
}