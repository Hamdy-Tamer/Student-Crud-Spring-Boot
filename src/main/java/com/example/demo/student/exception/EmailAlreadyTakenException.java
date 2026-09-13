package com.example.demo.student.exception;

public class EmailAlreadyTakenException extends RuntimeException {

    public EmailAlreadyTakenException(String email) {
        super("Email " + email + " is already taken");
    }

    public EmailAlreadyTakenException(String message, Throwable cause) {
        super(message, cause);
    }
}