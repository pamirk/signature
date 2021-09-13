import { useState, useCallback, useMemo } from 'react';

type SelectableItem<T> = T & { isSelected: boolean };

interface ToggleSelectableItem<TItem, Key extends keyof TItem> {
  (targetItemId: TItem[Key] | TItem[Key][]): void;
}

interface ToggleSelectableItemOne<TItem, Key extends keyof TItem> {
  (targetItemId: TItem[Key]): void;
}

interface ToggleSelectableItemMany<TItem, Key extends keyof TItem> {
  (targetItemId: TItem[Key][]): void;
}

interface ClearSelection {
  (): void;
}

export default <TItem, Key extends keyof TItem>(items: TItem[], idKey: Key) => {
  const [selectedItems, changeItemSelection] = useState<SelectableItem<TItem>[]>([]);

  const itemsSelection = useMemo(() => {
    return items.map(item => {
      const isSelected = !!selectedItems.find(
        selectedItem => selectedItem[idKey] === item[idKey],
      );
      return { ...item, isSelected };
    });
  }, [items, selectedItems, idKey]);

  const toggleOne: ToggleSelectableItemOne<TItem, Key> = useCallback(
    (targetItemId: TItem[Key]) => {
      const newItem = items.find(item => item[idKey] === targetItemId);

      let newSelectedItems:any;

      const existsSelectedItems = selectedItems.filter(
        item => item[idKey] === targetItemId,
      );
      if (existsSelectedItems.length) {
        newSelectedItems = selectedItems.filter(item => item[idKey] !== targetItemId);
      } else {
        newSelectedItems = [...selectedItems, newItem];
      }
      changeItemSelection(newSelectedItems);
    },
    [idKey, items, selectedItems],
  );

  const toggleMany: ToggleSelectableItemMany<TItem, Key> = useCallback(
    (targetItemIds: TItem[Key][]) => {
      const newItems = items.filter(item =>
        targetItemIds.find(targetItemId => item[idKey] === targetItemId),
      );

      let newSelectedItems:any;

      const isAllSelected = targetItemIds.every(targetItemId =>
        selectedItems.find(item => item[idKey] === targetItemId),
      );

      if (isAllSelected) {
        newSelectedItems = selectedItems.filter(
          item => !targetItemIds.find(targetItemId => targetItemId === item[idKey]),
        );
      } else {
        newSelectedItems = [...selectedItems, ...newItems];
      }
      changeItemSelection(newSelectedItems);
    },
    [idKey, items, selectedItems],
  );

  const toggleItemSelection: ToggleSelectableItem<TItem, Key> = useCallback(
    (targetItem: TItem[Key] | TItem[Key][]) => {
      if (Array.isArray(targetItem)) {
        toggleMany(targetItem);
      } else {
        toggleOne(targetItem);
      }
    },
    [toggleMany, toggleOne],
  );

  const clearSelection: ClearSelection = useCallback(() => {
    changeItemSelection([]);
  }, []);

  return [itemsSelection, toggleItemSelection, selectedItems, clearSelection] as const;
};
