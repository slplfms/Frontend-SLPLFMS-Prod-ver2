import { useState } from 'react';

export type SelectionHook = {
  selected: Set<string>;
  selectAll: () => void;
  deselectAll: () => void;
  selectOne: (id: string) => void;
  deselectOne: (id: string) => void;
};

export function useSelection(initialSelection: string[]): SelectionHook {
  const [selected, setSelected] = useState(new Set<string>(initialSelection));

  const selectAll = () => {
    setSelected(new Set<string>(initialSelection));
  };

  const deselectAll = () => {
    setSelected(new Set<string>());
  };

  const selectOne = (id: string) => {
    setSelected((prevSelected) => {
      const newSelected = new Set<string>(prevSelected);
      newSelected.add(id);
      return newSelected;
    });
  };

  const deselectOne = (id: string) => {
    setSelected((prevSelected) => {
      const newSelected = new Set<string>(prevSelected);
      newSelected.delete(id);
      return newSelected;
    });
  };

  return {
    selected,
    selectAll,
    deselectAll,
    selectOne,
    deselectOne,
  };
}
