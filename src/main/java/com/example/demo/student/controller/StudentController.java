package com.example.demo.student.controller;

import com.example.demo.student.service.StudentService;
import com.example.demo.student.domain.Student;
import com.example.demo.student.patchrequest.StudentPatchRequest;
import com.example.demo.student.request.StudentRequest;
import com.example.demo.student.response.StudentResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<StudentResponse> getStudents() {
        return studentService.getStudents()
                .stream()
                .map(StudentResponse::fromStudent)
                .toList();
    }

    @PostMapping
    public ResponseEntity<StudentResponse> registerNewStudent(
            @RequestBody @Valid StudentRequest request) {

        Student createdStudent = studentService.addNewStudent(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(StudentResponse.fromStudent(createdStudent));
    }

    @DeleteMapping(path = "/{studentId}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllStudents() {
        studentService.deleteAllStudents();
        return ResponseEntity.noContent().build();
    }

    @PutMapping(path = "/{studentId}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long studentId,
            @RequestBody @Valid StudentRequest request) {

        Student updated = studentService.updateStudent(studentId, request);
        return ResponseEntity.ok(StudentResponse.fromStudent(updated));
    }

    @PatchMapping(path = "/{studentId}")
    public ResponseEntity<StudentResponse> patchStudent(
            @PathVariable Long studentId,
            @RequestBody @Valid StudentPatchRequest request) {

        Student patched = studentService.patchStudent(studentId, request);
        return ResponseEntity.ok(StudentResponse.fromStudent(patched));
    }
}