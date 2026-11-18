import { useEffect, useState } from 'react';
import { fetchProgress } from '../../api';
import { CourseProgress } from '../../types';
import { CourseList, CoursesSectionHeader, Filter, Intro } from './components';
import { trackProgressViewed } from '../../utils/analytics';

//TODO extract button into reusable ui component

type ProgressState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; courses: CourseProgress[] };

const HomePage = (): React.JSX.Element => {
  const [learnerId, setLearnerId] = useState(1);
  const [minCompletion, setMinCompletion] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [serverState, setServerState] = useState<ProgressState>({ status: 'loading' });

  const handleSelectLearnerChange = (value: number) => {
    setLearnerId(value);
  };

  const handleSelectMinimumChange = (value: number) => {
    setMinCompletion(value);
  };

  //TODO create individual handlers for refresh and try again buttons in case business logic diverges upon scalability
  const refresh = () => {
    setRefreshCount((count) => count + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadProgress = async () => {
      setServerState({ status: 'loading' });
      try {
        const courses = await fetchProgress(learnerId, minCompletion, controller.signal);
        if (!controller.signal.aborted) {
          setServerState({ status: 'success', courses });
          trackProgressViewed(learnerId, minCompletion, courses.length);
        }
      } catch (error: unknown) {
        if (!controller.signal.aborted) {
          const message =
            error instanceof Error && !(error instanceof TypeError)
              ? error.message
              : 'We couldn’t reach your progress. Please try again.';
          setServerState({ status: 'error', message });
        }
      }
    };

    void loadProgress();

    return () => controller.abort();
  }, [learnerId, minCompletion, refreshCount]);

  return (
    <>
      <Intro />

      <Filter
        learnerId={learnerId}
        handleSelectLearnerChange={handleSelectLearnerChange}
        handleSelectMinimumChange={handleSelectMinimumChange}
        minCompletion={minCompletion}
        refresh={refresh}
        isLoading={serverState.status === 'loading'}
      />

      <section className="results" aria-labelledby="courses-heading" aria-busy={serverState.status === 'loading'}>
        <CoursesSectionHeader courseCount={serverState.status === 'success' ? serverState.courses.length : undefined} />

        {serverState.status === 'loading' && (
          <div className="state-panel" role="status">
            <span className="loading-indicator" aria-hidden="true" />
            <h3>Loading your progress</h3>
            <p>Getting your latest course activity…</p>
          </div>
        )}

        {serverState?.status === 'error' && (
          <div className="state-panel error-panel" role="alert">
            <span className="state-symbol" aria-hidden="true">
              !
            </span>
            <h3>Your progress couldn’t be loaded</h3>
            <p>{serverState.message}</p>
            <button className="button button-primary" onClick={refresh}>
              Try again
            </button>
          </div>
        )}

        {serverState?.status === 'success' && serverState?.courses?.length === 0 && (
          <div className="state-panel">
            <span className="state-symbol" aria-hidden="true">
              —
            </span>
            <h3>{minCompletion > 0 ? 'No courses match this filter' : 'No courses in progress'}</h3>
            <p>
              {minCompletion > 0
                ? 'Try a lower minimum completion to see more of your learning.'
                : 'Your courses will appear here once you start learning.'}
            </p>
            {minCompletion > 0 && (
              <button className="button button-primary" onClick={() => handleSelectMinimumChange(0)}>
                Clear filter
              </button>
            )}
          </div>
        )}

        {serverState?.status === 'success' && serverState?.courses?.length > 0 && (
          <CourseList courses={serverState.courses} />
        )}
      </section>
    </>
  );
};

export default HomePage;
