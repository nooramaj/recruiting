import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'post_job_screen.dart';
import 'past_jobs_screen.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Freelance Jo"),
        backgroundColor: Colors.blueAccent,

        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == "post") {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => PostJobScreen()),
                );
              } else if (value == "past") {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => PastJobsScreen()),
                );
              } else if (value == "logout") {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => LoginScreen()),
                );
              }
            },
            itemBuilder: (_) => [
              PopupMenuItem(value: "post", child: Text("Host Job")),
              PopupMenuItem(value: "past", child: Text("Past Jobs")),
              PopupMenuItem(value: "logout", child: Text("Logout")),
            ],
          ),
        ],
      ),

      body: SingleChildScrollView(

        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,

          children: [

            const Text(
              "Available job opportunities:",
              style: TextStyle(
                fontSize: 20,
                color: Colors.black,
              ),
            ),

            const SizedBox(height: 15),


            // 🔹 JOB BOX 1
            _jobBox("Dentist", "50\$"),

            const SizedBox(height: 20),

            // 🔹 JOB BOX 2
            _jobBox("Waiter", "10\$"),

            const SizedBox(height: 20),

            // 🔹 JOB BOX 3
            _jobBox("Photographer", "15\$"),

            const SizedBox(height: 20),

            // 🔹 JOB BOX 4
            _jobBox("Gardener", "8\$"),

            const SizedBox(height: 20),

            // 🔹 JOB BOX 5
            _jobBox("Electrician", "11\$"),

            const SizedBox(height: 20),

            // 🔹 JOB BOX 6
            _jobBox("Secretary", "21\$"),
            const SizedBox(height: 20),

            // 🔹 JOB BOX 7
            _jobBox("Hairdresser", "16\$"),

            const SizedBox(height: 20),

            // 🔹 JOB BOX 8
            _jobBox("Cheif", "14\$"),
          ],
        ),
      ),

    );
  }
}
Widget _jobBox(String title, String salary) {
  return Card(
    elevation: 6,
    margin: const EdgeInsets.symmetric(vertical: 6),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(35),
      side: const BorderSide(color: Colors.blueAccent, width: 1),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: const Icon(Icons.work_outline, color: Colors.black54),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        subtitle: Text(
          "Salary: $salary",
          style: const TextStyle(color: Colors.black87),
        ),

      ),
    ),
  );
}


