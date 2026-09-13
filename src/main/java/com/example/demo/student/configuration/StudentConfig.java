/*package com.example.demo.student.configuration;

import com.example.demo.student.domain.Gender;
import com.example.demo.student.domain.Student;
import com.example.demo.student.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class StudentConfig {

    @Bean
    CommandLineRunner studentCommandLineRunner(StudentRepository repository) {
        return args -> {
            Student hamdy = new Student(
                    "Hamdy Tamer", "hamdytamer253@gmail.com",
                    Gender.MALE, LocalDate.of(2004, 8, 29));

            Student farah = new Student(
                    "Farah Ahmed", "farahahmed690@gmail.com",
                    Gender.FEMALE, LocalDate.of(2001, 5, 7));

            Student tamer = new Student(
                    "Tamer Alaa", "tamerhamdy470@gmail.com",
                    Gender.MALE, LocalDate.of(1974, 10, 30));

            repository.saveAll(List.of(hamdy, farah, tamer));
        };
    }
}
*/