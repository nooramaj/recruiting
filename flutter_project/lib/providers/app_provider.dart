import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/job.dart';

class AppProvider extends ChangeNotifier {
  List<Job> _jobs = [];
  String? _currentUser;
  String? _currentUserEmail;
  bool _isLoggedIn = false;

  List<Job> get jobs => _jobs;
  String? get currentUser => _currentUser;
  String? get currentUserEmail => _currentUserEmail;
  bool get isLoggedIn => _isLoggedIn;

  List<Job> get myJobs =>
      _jobs.where((j) => j.postedBy == _currentUserEmail).toList();

  AppProvider() {
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final jobsJson = prefs.getString('jobs');
    final user = prefs.getString('currentUser');
    final email = prefs.getString('currentUserEmail');

    if (jobsJson != null) {
      final List<dynamic> decoded = json.decode(jobsJson);
      _jobs = decoded.map((j) => Job.fromMap(j)).toList();
    } else {
      _jobs = _seedJobs();
      _saveJobs();
    }

    if (user != null && email != null) {
      _currentUser = user;
      _currentUserEmail = email;
      _isLoggedIn = true;
    }

    notifyListeners();
  }

  Future<void> _saveJobs() async {
    final prefs = await SharedPreferences.getInstance();
    final jobsJson = json.encode(_jobs.map((j) => j.toMap()).toList());
    await prefs.setString('jobs', jobsJson);
  }

  Future<void> login(String email, String password, String name) async {
    final prefs = await SharedPreferences.getInstance();
    _currentUser = name.isNotEmpty ? name : email.split('@').first;
    _currentUserEmail = email;
    _isLoggedIn = true;
    await prefs.setString('currentUser', _currentUser!);
    await prefs.setString('currentUserEmail', _currentUserEmail!);
    notifyListeners();
  }

  Future<void> register(String name, String email, String password) async {
    await login(email, password, name);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    _currentUser = null;
    _currentUserEmail = null;
    _isLoggedIn = false;
    await prefs.remove('currentUser');
    await prefs.remove('currentUserEmail');
    notifyListeners();
  }

  Future<void> addJob(Job job) async {
    _jobs.insert(0, job);
    await _saveJobs();
    notifyListeners();
  }

  Future<void> deleteJob(String id) async {
    _jobs.removeWhere((j) => j.id == id);
    await _saveJobs();
    notifyListeners();
  }

  List<Job> searchJobs(String query) {
    if (query.isEmpty) return _jobs;
    final q = query.toLowerCase();
    return _jobs
        .where((j) =>
            j.title.toLowerCase().contains(q) ||
            j.location.toLowerCase().contains(q) ||
            j.category.toLowerCase().contains(q) ||
            j.description.toLowerCase().contains(q))
        .toList();
  }

  List<Job> filterByCategory(String category) {
    if (category == 'All') return _jobs;
    return _jobs.where((j) => j.category == category).toList();
  }

  List<Job> _seedJobs() {
    return [
      Job(
        id: '1',
        title: 'Dentist',
        description:
            'Experienced dentist needed for a private clinic in Amman. Must have 3+ years of experience with modern dental equipment and patient care.',
        salary: '50',
        age: '28',
        category: 'Healthcare',
        location: 'Amman',
        postedBy: 'clinic@example.com',
        phone: '962791234567',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      Job(
        id: '2',
        title: 'Waiter',
        description:
            'Friendly and energetic waiter needed for a busy restaurant. Must be comfortable working evening shifts and weekends.',
        salary: '10',
        age: '18',
        category: 'Hospitality',
        location: 'Irbid',
        postedBy: 'restaurant@example.com',
        phone: '962797654321',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      Job(
        id: '3',
        title: 'Photographer',
        description:
            'Creative photographer for events and portraits. Must have own equipment and a strong portfolio.',
        salary: '15',
        age: '20',
        category: 'Creative',
        location: 'Amman',
        postedBy: 'studio@example.com',
        phone: '962791112233',
        createdAt: DateTime.now().subtract(const Duration(hours: 8)),
      ),
      Job(
        id: '4',
        title: 'Gardener',
        description:
            'Skilled gardener for residential properties. Knowledge of local plants and landscaping required.',
        salary: '8',
        age: '22',
        category: 'Services',
        location: 'Ajloun',
        postedBy: 'home@example.com',
        phone: '962794445566',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
      Job(
        id: '5',
        title: 'Electrician',
        description:
            'Licensed electrician for commercial and residential projects. Must have safety certifications.',
        salary: '11',
        age: '25',
        category: 'Technical',
        location: 'AL-Zarqaa',
        postedBy: 'electric@example.com',
        phone: '962796667788',
        createdAt: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      ),
      Job(
        id: '6',
        title: 'Secretary',
        description:
            'Organized secretary for a law firm. Must be proficient in MS Office and have excellent communication skills.',
        salary: '21',
        age: '23',
        category: 'Office',
        location: 'Amman',
        postedBy: 'law@example.com',
        phone: '962798889900',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      Job(
        id: '7',
        title: 'Hairdresser',
        description:
            'Talented hairdresser for a modern salon. Experience with coloring, cutting, and styling required.',
        salary: '16',
        age: '20',
        category: 'Creative',
        location: 'Irbid',
        postedBy: 'salon@example.com',
        phone: '962791234000',
        createdAt: DateTime.now().subtract(const Duration(days: 2, hours: 5)),
      ),
      Job(
        id: '8',
        title: 'Chef',
        description:
            'Experienced chef specializing in Middle Eastern cuisine. Must be creative with menu development.',
        salary: '14',
        age: '24',
        category: 'Hospitality',
        location: 'Aqaba',
        postedBy: 'hotel@example.com',
        phone: '962795556677',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
  }
}
