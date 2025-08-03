import { CancellationReason } from 'Interfaces/UserFeedbacks';

import emojiSadIcon from 'Assets/images/icons/emoji-sad-icon.svg';
import holidaysIcon from 'Assets/images/icons/holidays-icon.svg';
import priceIcon from 'Assets/images/icons/price-icon.svg';
import questionMarkIcon from 'Assets/images/icons/question-mark-icon.svg';
import searchRightIcon from 'Assets/images/icons/search-right.svg';

export const optionsDataByUserPlan = {
  trial: [
    {
      id: 1,
      icon: searchRightIcon,
      description: 'I was testing the service',
      cancellationReason: CancellationReason.TESTING_THE_SERVICE,
    },
    {
      id: 2,
      icon: emojiSadIcon,
      description: 'The app was difficult to use',
      cancellationReason: CancellationReason.DIFFICULT_TO_USE,
    },
    {
      id: 3,
      icon: priceIcon,
      description: 'The price is too High',
      cancellationReason: CancellationReason.PRICING,
    },
    {
      id: 4,
      icon: questionMarkIcon,
      description: 'Other Reasons',
      cancellationReason: CancellationReason.OTHER,
    },
  ],
  monthly: [
    {
      id: 5,
      icon: searchRightIcon,
      description: 'I was testing the service',
      cancellationReason: CancellationReason.TESTING_THE_SERVICE,
    },
    {
      id: 6,
      icon: emojiSadIcon,
      description: 'The app was difficult to use',
      cancellationReason: CancellationReason.DIFFICULT_TO_USE,
    },
    {
      id: 7,
      icon: priceIcon,
      description: 'The price is too High',
      cancellationReason: CancellationReason.PRICING,
    },
    {
      id: 8,
      icon: questionMarkIcon,
      description: 'Other Reasons',
      cancellationReason: CancellationReason.OTHER,
    },
  ],
  yearly: [
    {
      id: 9,
      icon: searchRightIcon,
      description: "I'm not using the Service Enough",
      cancellationReason: CancellationReason.NOT_ENOUGH_USE,
    },
    {
      id: 10,
      icon: holidaysIcon,
      description: 'Having a Break',
      cancellationReason: CancellationReason.HAVING_A_BREAK,
    },
    {
      id: 11,
      icon: priceIcon,
      description: 'Financial Reason',
      cancellationReason: CancellationReason.FINANCIAL_TROUBLE,
    },
    {
      id: 12,
      icon: questionMarkIcon,
      description: 'Other Reasons',
      cancellationReason: CancellationReason.OTHER,
    },
  ],
} as Record<
  'trial' | 'monthly' | 'yearly',
  {
    id: number;
    icon: string;
    description: string;
    cancellationReason: CancellationReason;
  }[]
>;
