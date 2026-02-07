class Job {
  final String id;
  final String title;
  final String description;
  final String salary;
  final String age;
  final String category;
  final String location;
  final String postedBy;
  final String phone;
  final DateTime createdAt;

  Job({
    required this.id,
    required this.title,
    required this.description,
    required this.salary,
    required this.age,
    required this.category,
    required this.location,
    required this.postedBy,
    required this.phone,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'salary': salary,
      'age': age,
      'category': category,
      'location': location,
      'postedBy': postedBy,
      'phone': phone,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Job.fromMap(Map<String, dynamic> map) {
    return Job(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      salary: map['salary'] ?? '',
      age: map['age'] ?? '',
      category: map['category'] ?? '',
      location: map['location'] ?? '',
      postedBy: map['postedBy'] ?? '',
      phone: map['phone'] ?? '',
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'])
          : DateTime.now(),
    );
  }
}
