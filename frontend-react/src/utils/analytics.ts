const trackProgressViewed = (learnerId: number, minCompletion: number, courseCount: number): void => {
  console.info(JSON.stringify({
    event: 'course_progress_viewed',
    learnerId,
    minCompletion,
    courseCount,
    timestamp: new Date().toISOString(),
  }));
};

export { trackProgressViewed };
