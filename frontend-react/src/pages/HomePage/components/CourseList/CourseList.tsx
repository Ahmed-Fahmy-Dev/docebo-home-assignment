import { CourseCard } from '../../../../components';
import type { CourseProgress } from '../../../../types';

type CourseListProps = {
  courses: CourseProgress[];
};

const CourseList = ({ courses }: CourseListProps): React.JSX.Element => {
  return (
    <ul className="course-list">
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </ul>
  );
};

export default CourseList;
