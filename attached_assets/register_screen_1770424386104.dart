import 'package:flutter/material.dart';


import 'home_screen.dart';

class RegisterScreen extends StatefulWidget {
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameC = TextEditingController();
  final _emailC = TextEditingController();
  final _passC = TextEditingController();
  final _AgeC = TextEditingController();
  final _phoneC = TextEditingController();

  String selectedCity = "Amman";


  final List<String> cities = [
    "Amman",
    "Irbid",
    "Zarqa",
    "Ajloun",
    "Aqaba",
  ];



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register"),
        backgroundColor: Colors.blueAccent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(25),
        child: Column(
          children: [
            const SizedBox(height: 20),

            Stack(
              alignment: Alignment.bottomRight,
              children: [
                CircleAvatar(
                  radius: 60,
                  backgroundColor: Colors.grey.shade300,
                  child: const Icon(
                    Icons.person,
                    size: 70,
                    color: Colors.white,
                  ),
                ),
                CircleAvatar(
                  radius: 18,
                  backgroundColor: Colors.blueAccent,
                  child: const Icon(
                    Icons.camera_alt,
                    size: 16,
                    color: Colors.white,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            const SizedBox(height: 20),
            const Text(
              "Please enter your information:",
              style: TextStyle(
                fontSize: 20,
                color: Colors.black,
              ),
            ),

            const SizedBox(height: 20),

            const SizedBox(height: 20),

            TextField(
              controller: _nameC,
              decoration: const InputDecoration(labelText: "Full Name"),
            ),
            const SizedBox(height: 20),

            TextField(
              controller: _emailC,
              decoration: const InputDecoration(labelText: "Email"),
            ),
            const SizedBox(height: 20),

            TextField(
              controller: _passC,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Password"),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _AgeC,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Age"),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _phoneC,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Phone Number"),
            ),
            const SizedBox(height: 20),

            //  CITY DROPDOWN
            DropdownButtonFormField<String>(
              value: selectedCity,
              decoration: const InputDecoration(
                labelText: "City",
                border: OutlineInputBorder(),
              ),
              items: cities
                  .map(
                    (city) => DropdownMenuItem(
                  value: city,
                  child: Text(city),
                ),
              )
                  .toList(),
              onChanged: (value) {
                setState(() {
                  selectedCity = value!;
                });
              },
            ),

            const SizedBox(height: 25),

            ElevatedButton(
              onPressed: () {
                // You can access:
                // _nameC.text
                // _emailC.text
                // selectedCity
                // _image

                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => HomeScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                side: const BorderSide(color: Colors.blueAccent, width: 2),
              ),
              child: const Text("Create Account",style: TextStyle(
                fontSize: 13,
                color: Colors.black54,),  ),
            ),
          ],
        ),
      ),
    );
  }
}
