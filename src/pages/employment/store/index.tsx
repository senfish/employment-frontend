/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom, } from "jotai";
import { atomWithImmer } from 'jotai-immer'
import { useCallback } from "react";
import { atom } from "jotai";

export const typeListAtom = atom([]);


export interface EmploymentListQuery {
  pageSize: number;
  page: number;
  name?: string;
  // taskName?: string;
}
export const initFilter = {
  pageSize: 8,
  page: 1
}
const filterAtom = atomWithImmer(initFilter)

export const useChange = (): {
  filter: EmploymentListQuery,
  onChangeFilter: (key: keyof EmploymentListQuery) => (value: any) => void,
  onResetFilter: () => EmploymentListQuery
} => {
  const [filter, setFilter] = useAtom<EmploymentListQuery>(filterAtom);

  const onChangeFilter = useCallback((key: keyof EmploymentListQuery) => {
    return function (value: any) {
      setFilter((draft) => {
        draft[key] = value;
        return draft;
      })
    }
  }, []);

  const onResetFilter = useCallback(() => {
    setFilter(() => {
      return initFilter
    })
    return initFilter;
  }, [])
  return { filter, onChangeFilter, onResetFilter }
}

