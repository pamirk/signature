import { useMemo, useState, useCallback } from 'react';
import lodash from 'lodash';
import { OrderingDirection } from 'Interfaces/Common';

interface RequestOrdering<TItem, Key extends keyof TItem> {
  (key, direction?): { key: Key; direction?: OrderingDirection };
}

export default <TItem, Key extends keyof TItem>(
  items: TItem[],
  config: { key: Key; direction: OrderingDirection },
) => {
  const [orderingConfig, setOrderingConfig] = useState(config);

  const orderedItems: TItem[] = useMemo(() => {
    if (orderingConfig)
      return lodash.orderBy(items, [orderingConfig.key], [orderingConfig.direction]);

    return items;
  }, [items, orderingConfig]);

  const requestOrdering: RequestOrdering<TItem, Key> = useCallback(
    (key: Key) => {
      let direction = OrderingDirection.ASC;
      if (orderingConfig && orderingConfig.key === key) {
        direction =
          orderingConfig.direction === OrderingDirection.DESC
            ? OrderingDirection.ASC
            : OrderingDirection.DESC;
      }
      setOrderingConfig({ key, direction });

      return { key, direction };
    },
    [orderingConfig],
  );

  return { orderedItems, requestOrdering, orderingConfig };
};
