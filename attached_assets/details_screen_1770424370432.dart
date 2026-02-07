import 'package:flutter/material.dart';
import 'post_job_screen.dart'; // contains Job model

class DetailsScreen extends StatelessWidget {
  final Job job;

  const DetailsScreen({super.key, required this.job});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Freelance Jo"),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Job Title: ${job.title}",
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),

            Text("Description: ${job.description}"),
            const SizedBox(height: 10),

            Text("Salary: ${job.salary}"),
            const SizedBox(height: 10),

            Text("Age: ${job.age}"),
            const SizedBox(height: 10),

            Text("Location: ${job.location}"),
            const SizedBox(height: 30),

            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 30,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.green, width: 2),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: const Text(
                  "WhatsApp",
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
