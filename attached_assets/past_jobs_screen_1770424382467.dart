import 'package:flutter/material.dart';
import 'post_job_screen.dart'; // postedJobs + Job
import 'details_screen.dart';

class PastJobsScreen extends StatelessWidget {
  const PastJobsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Past Jobs"),
        backgroundColor: Colors.blueAccent,
      ),
      body: postedJobs.isEmpty
          ? const Center(
        child: Text(
          "No past jobs yet",
          style: TextStyle(fontSize: 18),
        ),
      )
          : ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: postedJobs.length,
        itemBuilder: (context, index) {
          final job = postedJobs[index];

          return Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: ListTile(
              title: Text(job.title),
              subtitle: Text("Salary: ${job.salary}"),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DetailsScreen(job: job),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
