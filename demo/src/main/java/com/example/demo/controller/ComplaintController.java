package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Complaint;
import com.example.demo.service.ComplaintService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/complaints")
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<?> createComplaint(
            @RequestParam("name") String name,
            @RequestParam("date") LocalDate date,
            @RequestParam("priority") String priority,
            @RequestParam("description") String description,
            @RequestParam("cmpImage") MultipartFile image,
            @RequestParam("userId") Long userId) { // Added userId parameter
        try {
            Complaint complaint = complaintService.createComplaint(name, date, priority, description, image, userId);
            return ResponseEntity.ok(complaint);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing image");
        }
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }
}
