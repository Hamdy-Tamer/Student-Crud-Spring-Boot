package com.example.demo.student.service;

import com.example.demo.student.domain.Student;
import com.example.demo.student.exception.EmailAlreadyTakenException;
import com.example.demo.student.exception.StudentNotFoundException;
import com.example.demo.student.patchrequest.StudentPatchRequest;
import com.example.demo.student.repository.StudentRepository;
import com.example.demo.student.request.StudentRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    public Student addNewStudent(StudentRequest request) {
        studentRepository.findStudentByEmail(request.email())
                .ifPresent(s -> { throw new EmailAlreadyTakenException(request.email()); });

        Student student = new Student(
                request.name(),
                request.email(),
                request.gender(),
                request.dob()
        );

        return studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException(studentId);
        }
        studentRepository.deleteById(studentId);
    }

    public void deleteAllStudents() {
        studentRepository.deleteAll();
    }

    @Transactional
    public Student updateStudent(Long studentId, StudentRequest request) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        if (!Objects.equals(student.getEmail(), request.email())) {
            studentRepository.findStudentByEmail(request.email())
                    .ifPresent(s -> { throw new EmailAlreadyTakenException(request.email()); });
        }

        student.setName(request.name());
        student.setEmail(request.email());
        student.setDob(request.dob());
        student.setGender(request.gender());

        return studentRepository.save(student);
    }

    @Transactional
    public Student patchStudent(Long studentId, StudentPatchRequest request) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        if (request.email() != null
                && !Objects.equals(student.getEmail(), request.email())) {

            studentRepository.findStudentByEmail(request.email())
                    .ifPresent(s -> { throw new EmailAlreadyTakenException(request.email()); });

            student.setEmail(request.email());
        }

        if (request.name() != null)   student.setName(request.name());
        if (request.dob() != null)    student.setDob(request.dob());
        if (request.gender() != null) student.setGender(request.gender());

        return studentRepository.save(student);
    }
}