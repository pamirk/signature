import { useMediaQuery } from 'react-responsive';

export default () => {
  const isTablet = useMediaQuery({
    query: '(max-width: 1199px)',
  });
  return isTablet;
};
