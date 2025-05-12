import MediaPage from './MediaPage';

const categories = [
  'concentration', 'focus music', 'study music', 'work music',
  'instrumental', 'ambient', 'lofi', 'classical', 'time management',
  'binaural beats', 'alpha waves', 'white noise',
  'Pomodoro timer', 'study with me', 'coding music',
  'jazz for studying', 'coffee shop ambience'
];

const FocusPage = ({ onReturnToModeSelect }) => (
  <MediaPage
    onReturnToModeSelect={onReturnToModeSelect}
    pageTitle="Video for concentration"
    defaultQuery="nature"
    categories={categories}
  />
);

export default FocusPage;