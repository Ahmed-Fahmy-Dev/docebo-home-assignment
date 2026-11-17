export type CourseProgress = {
  courseId: string;
  title: string;
  completionPercentage: number;
  lastActivityAt: string;
  status: 'in_progress';
  isStale: boolean;
  isQuickWin: boolean;
};

export type LearnerProgressResponse = {
  learnerId: number;
  courses: CourseProgress[];
};
