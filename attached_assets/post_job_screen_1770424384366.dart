import 'package:flutter/material.dart';
import 'past_jobs_screen.dart';


List<Job> postedJobs = [];

class Job {
  String title;
  String location;
  String description;
  String salary;
  int age;

  Job({
    required this.title,
    required this.location,
    required this.description,
    required this.salary,
    required this.age,
  });
}

/* ======================
   POST JOB SCREEN
   ====================== */

class PostJobScreen extends StatefulWidget {
  const PostJobScreen({super.key});

  @override
  State<PostJobScreen> createState() => _PostJobScreenState();
}

class _PostJobScreenState extends State<PostJobScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _titleC = TextEditingController();
  final TextEditingController _descC = TextEditingController();
  final TextEditingController _salaryC = TextEditingController();
  final TextEditingController _ageC = TextEditingController();

  String city = "Amman";

  OutlineInputBorder _b() => OutlineInputBorder(
    borderRadius: BorderRadius.circular(20),
    borderSide: const BorderSide(color: Colors.blueAccent, width: 2.5),
  );

  @override
  void dispose() {
    _titleC.dispose();
    _descC.dispose();
    _salaryC.dispose();
    _ageC.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold( // ✅ was MaterialApp → FIXED
      appBar: AppBar(
        title: const Text(
          "Freelance Jo",
          style: TextStyle(fontSize: 20),
        ),
        backgroundColor: Colors.blueAccent,
      ),
      body: SingleChildScrollView(
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(32),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Job Title",
                  style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold),
                ),
                TextFormField(
                  controller: _titleC,
                  validator: (v) =>
                  v == null || v.trim().isEmpty
                      ? "What is the title of this job?"
                      : null,
                  decoration: InputDecoration(
                    hintText: "Name of the job...",
                    enabledBorder: _b(),
                    focusedBorder: _b(),
                  ),
                ),
                const SizedBox(height: 20),

                const Text(
                  "Job Description",
                  style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold),
                ),
                TextFormField(
                  controller: _descC,
                  maxLines: 3,
                  validator: (v) =>
                  v == null || v.trim().isEmpty
                      ? "Write a description!"
                      : null,
                  decoration: InputDecoration(
                    hintText: "....",
                    enabledBorder: _b(),
                    focusedBorder: _b(),
                  ),
                ),
                const SizedBox(height: 20),

                const Text(
                  "Salary",
                  style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold),
                ),
                TextFormField(
                  controller: _salaryC,
                  validator: (v) =>
                  v == null || v.trim().isEmpty
                      ? "Enter the salary!"
                      : null,
                  decoration: InputDecoration(
                    hintText: "Expected salary",
                    enabledBorder: _b(),
                    focusedBorder: _b(),
                  ),
                ),
                const SizedBox(height: 20),

                TextFormField(
                  controller: _ageC,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: "Minimum Age",
                    icon: Icon(Icons.groups),
                  ),
                  validator: (age) {
                    if (age == null || age.trim().isEmpty) {
                      return "Enter age";
                    }
                    final n = int.tryParse(age);
                    if (n == null) return "Age must be a number";
                    if (n < 18) return "Minimum age is 18";
                    return null;
                  },
                ),
                const SizedBox(height: 15),

                const Text(
                  "Location",
                  style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold),
                ),
                DropdownButton<String>(
                  value: city,
                  items: citys
                      .map(
                        (c) => DropdownMenuItem(
                      value: c,
                      child: Text(c),
                    ),
                  )
                      .toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => city = v);
                  },
                ),
                const SizedBox(height: 25),

                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      if (!_formKey.currentState!.validate()) return;

                      final job = Job(
                        title: _titleC.text.trim(),
                        description: _descC.text.trim(),
                        salary: _salaryC.text.trim(),
                        location: city,
                        age: int.parse(_ageC.text.trim()),
                      );

                      postedJobs.add(job);

                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PastJobsScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      side: const BorderSide(color: Colors.blueAccent, width: 2),
                    ),
                    child: const Text("Post",style: TextStyle(
                      fontSize: 15,
                      color: Colors.black54,),  ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/* ======================
   CITY LIST (UNCHANGED)
   ====================== */

List<String> citys = ["Amman", "Irbid", "Ajloun", "AL-Zarqaa"];