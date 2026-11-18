type CoursesSectionHeaderProps = {
  courseCount?: number;
};

const CoursesSectionHeader = ({ courseCount }: CoursesSectionHeaderProps): React.JSX.Element => {
  return (
    <div className="results-heading">
      <div>
        <h2 id="courses-heading">In-progress courses</h2>
        <p className="sort-note">Most recent activity first</p>
      </div>
      {courseCount !== undefined && (
        <span className="result-count" role="status">
          {courseCount} {courseCount === 1 ? 'course' : 'courses'}
        </span>
      )}
    </div>
  );
};

export default CoursesSectionHeader;
