import { CourseProgress } from '../../types';
import { dateFormatter } from '../../utils/dateFormatter';

type CourseCardProps = {
  course: CourseProgress;
};

const CourseCard = ({ course }: CourseCardProps): React.JSX.Element => {
  return (
    <li className="course">
      <div className="course-heading">
        <h3>{course?.title}</h3>
        {(course?.isStale || course.isQuickWin) && (
          <div className="badges">
            {course?.isStale && (
              <span className="badge badge-inactive" title="More than 30 days without activity">
                Inactive
              </span>
            )}
            {course?.isQuickWin && <span className="badge badge-quick">Quick win · 1 lesson left</span>}
          </div>
        )}
      </div>
      <div className="completion-label">
        <span>In progress</span>
        <span>
          <strong>{course?.completionPercentage}%</strong> complete
        </span>
      </div>
      <progress value={course?.completionPercentage} max={100} aria-label={`${course?.title} completion`} />
      <p className="last-activity">
        Last active{' '}
        <time dateTime={course?.lastActivityAt}>{dateFormatter.format(new Date(course?.lastActivityAt))}</time>
      </p>
    </li>
  );
};

export default CourseCard;
