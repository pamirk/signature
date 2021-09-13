import { useMediaQuery } from 'react-responsive';

export default () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  });
  return isMobile;
};
