package com.example.demo.student.response;

import com.example.demo.student.domain.Gender;
import com.example.demo.student.domain.Student;

import java.time.LocalDate;

public record StudentResponse(
        Long id,
        String name,
        String email,
        Gender gender,
        LocalDate dob,
        int age
) {

    public static StudentResponse fromStudent(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getGender(),
                student.getDob(),
                student.computeAge()
        );
    }
}