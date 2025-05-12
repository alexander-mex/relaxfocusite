import MediaPage from './MediaPage';

const categories = [
  'nature', 'forest', 'water', 'ocean', 'sky', 'mountains',
  'sunset', 'flowers', 'relaxation', 'meditation', 'calm',
  'peaceful', 'forest sounds', 'rain sounds', 'piano study',
  'waterfall', 'birds singing', 'fireplace', 'thunderstorm',
  'zen garden', 'autumn leaves', 'winter landscape', 'summer breeze'
];

const RelaxPage = ({ onReturnToModeSelect }) => (
  <MediaPage
    onReturnToModeSelect={onReturnToModeSelect}
    pageTitle="Relax video"
    defaultQuery="nature"
    categories={categories}
  />
);

export default RelaxPage;