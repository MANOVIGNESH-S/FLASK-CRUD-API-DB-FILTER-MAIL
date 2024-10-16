package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Complaint;
import com.example.demo.model.User;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.UserRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository; // Add UserRepository to fetch User by ID

    public Complaint createComplaint(String name, LocalDate date, String priority, String description, MultipartFile image, Long userId) throws IOException {
        Complaint complaint = new Complaint();
        complaint.setName(name);
        complaint.setDate(date);
        complaint.setPriority(priority);
        complaint.setDescription(description);
        complaint.setImage(image.getBytes());

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        complaint.setUser(user);

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
}
