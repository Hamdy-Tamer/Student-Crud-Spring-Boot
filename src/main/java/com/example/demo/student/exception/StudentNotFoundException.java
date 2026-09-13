package com.example.demo.student.exception;

public class StudentNotFoundException extends RuntimeException {

    public StudentNotFoundException(Long studentId) {
        super("Student with id " + studentId + " not found");
    }

    public StudentNotFoundException(String message) {
        super(message);
    }
}