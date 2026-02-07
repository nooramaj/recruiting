import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../providers/app_provider.dart';
import 'post_job_screen.dart';
import 'job_details_screen.dart';

class MyJobsScreen extends StatefulWidget {
  const MyJobsScreen({super.key});

  @override
  State<MyJobsScreen> createState() => _MyJobsScreenState();
}

class _MyJobsScreenState extends State<MyJobsScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _fadeAnim = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOut,
    );
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        final myJobs = provider.myJobs;

        return Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF0A0E1A), Color(0xFF141929)],
              ),
            ),
            child: SafeArea(
              child: FadeTransition(
                opacity: _fadeAnim,
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(8, 8, 20, 16),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () => Navigator.pop(context),
                            icon: const Icon(Icons.arrow_back_ios_new,
                                color: AppColors.textPrimary),
                          ),
                          const Expanded(
                            child: Text(
                              'My Posted Jobs',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const PostJobScreen(),
                                ),
                              );
                            },
                            icon: const Icon(Icons.add,
                                color: AppColors.primary),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: myJobs.isEmpty
                          ? _buildEmpty()
                          : ListView.builder(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 20),
                              itemCount: myJobs.length,
                              itemBuilder: (context, index) {
                                final job = myJobs[index];
                                final color =
                                    AppTheme.getCategoryColor(job.category);
                                return Padding(
                                  padding:
                                      const EdgeInsets.only(bottom: 12),
                                  child: Dismissible(
                                    key: Key(job.id),
                                    direction:
                                        DismissDirection.endToStart,
                                    background: Container(
                                      alignment: Alignment.centerRight,
                                      padding: const EdgeInsets.only(
                                          right: 20),
                                      decoration: BoxDecoration(
                                        color: AppColors.danger
                                            .withOpacity(0.2),
                                        borderRadius:
                                            BorderRadius.circular(16),
                                      ),
                                      child: const Icon(Icons.delete,
                                          color: AppColors.danger),
                                    ),
                                    confirmDismiss: (direction) async {
                                      return await showDialog<bool>(
                                        context: context,
                                        builder: (ctx) => AlertDialog(
                                          backgroundColor:
                                              AppColors.surface,
                                          title: const Text(
                                            'Delete Job',
                                            style: TextStyle(
                                                color: AppColors
                                                    .textPrimary),
                                          ),
                                          content: Text(
                                            'Delete "${job.title}"?',
                                            style: const TextStyle(
                                                color: AppColors
                                                    .textSecondary),
                                          ),
                                          actions: [
                                            TextButton(
                                              onPressed: () =>
                                                  Navigator.pop(
                                                      ctx, false),
                                              child: const Text(
                                                  'Cancel'),
                                            ),
                                            TextButton(
                                              onPressed: () =>
                                                  Navigator.pop(
                                                      ctx, true),
                                              child: const Text(
                                                'Delete',
                                                style: TextStyle(
                                                    color: AppColors
                                                        .danger),
                                              ),
                                            ),
                                          ],
                                        ),
                                      );
                                    },
                                    onDismissed: (_) {
                                      provider.deleteJob(job.id);
                                    },
                                    child: GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) =>
                                                JobDetailsScreen(
                                                    job: job),
                                          ),
                                        );
                                      },
                                      child: Container(
                                        padding:
                                            const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          color: AppColors.surface,
                                          borderRadius:
                                              BorderRadius.circular(16),
                                          border: Border.all(
                                              color: AppColors.border),
                                        ),
                                        child: Row(
                                          children: [
                                            Container(
                                              width: 44,
                                              height: 44,
                                              decoration: BoxDecoration(
                                                color: color
                                                    .withOpacity(0.15),
                                                borderRadius:
                                                    BorderRadius.circular(
                                                        12),
                                              ),
                                              child: Icon(
                                                AppTheme
                                                    .getCategoryIcon(
                                                        job.category),
                                                color: color,
                                                size: 22,
                                              ),
                                            ),
                                            const SizedBox(width: 14),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment
                                                        .start,
                                                children: [
                                                  Text(
                                                    job.title,
                                                    style:
                                                        const TextStyle(
                                                      fontSize: 16,
                                                      fontWeight:
                                                          FontWeight
                                                              .w600,
                                                      color: AppColors
                                                          .textPrimary,
                                                    ),
                                                  ),
                                                  const SizedBox(
                                                      height: 4),
                                                  Text(
                                                    '${job.location} - ${job.category}',
                                                    style:
                                                        const TextStyle(
                                                      fontSize: 13,
                                                      color: AppColors
                                                          .textMuted,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            Text(
                                              '\$${job.salary}/hr',
                                              style: TextStyle(
                                                fontSize: 15,
                                                fontWeight:
                                                    FontWeight.w700,
                                                color: color,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_outlined,
              size: 56, color: AppColors.textMuted.withOpacity(0.5)),
          const SizedBox(height: 16),
          const Text(
            'No Jobs Posted',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Post your first job to see it here',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PostJobScreen()),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
              padding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            ),
            child: const Text('Post Your First Job'),
          ),
        ],
      ),
    );
  }
}
