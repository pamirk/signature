import { BingTrackerType } from './Interfaces';

class BingTracker implements BingTrackerType {
  fireRegistrationEvent = () => {
    try {
      //@ts-ignore
      // eslint-disable-next-line no-undef
      window.uetq = window.uetq || [];
      //@ts-ignore
      // eslint-disable-next-line no-undef
      window.uetq.push('event', 'Form filled', {
        event_category: 'Form submission',
        event_label: 'Signup',
      });
    } catch (error) {
      console.log(error);
    }
  };

  firePageChangeEvent = (path: string) => {
    try {
      //@ts-ignore
      // eslint-disable-next-line no-undef
      window.uetq = window.uetq || [];
      //@ts-ignore
      // eslint-disable-next-line no-undef
      window.uetq.push('event', 'page_view', { page_path: path });
    } catch (error) {
      console.log(error);
    }
  };
}

export default new BingTracker();
