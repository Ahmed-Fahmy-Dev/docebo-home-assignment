import { DropdownSelect } from '../../../../components';
import { DEMO_LEARNER_OPTIONS, MIN_COMPLETION_OPTIONS } from '../../../../constants';

//TODO extract reusable JSX into reusable components, ex: svg, button etc...
//TODO introduce memoizing in case profiling reveals performance problem

type FilterProps = {
  learnerId: number;
  handleSelectLearnerChange: (value: number) => void;
  handleSelectMinimumChange: (value: number) => void;
  minCompletion: number;
  refresh: () => void;
  isLoading: boolean;
};

const Filter = ({
  learnerId,
  handleSelectLearnerChange,
  handleSelectMinimumChange,
  minCompletion,
  refresh,
  isLoading,
}: FilterProps): React.JSX.Element => {
  return (
    <div className="toolbar" aria-label="Progress controls">
      <DropdownSelect
        label="Demo learner"
        id="learner"
        value={learnerId}
        options={DEMO_LEARNER_OPTIONS}
        onChange={(value) => handleSelectLearnerChange(Number(value))}
      />

      <DropdownSelect
        label="Minimum completion"
        id="minimum-completion"
        value={minCompletion}
        options={MIN_COMPLETION_OPTIONS}
        onChange={(value) => handleSelectMinimumChange(Number(value))}
      />

      <button className="button button-secondary refresh-button" onClick={refresh} disabled={isLoading}>
        <svg
          className={isLoading ? 'refresh-icon spinning' : 'refresh-icon'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M6.1 7a7 7 0 0 1 11.5-1L20 9M4 15l2.4 3A7 7 0 0 0 17.9 17" />
        </svg>
        Refresh
      </button>
    </div>
  );
};

export default Filter;
