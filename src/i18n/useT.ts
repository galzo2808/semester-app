import { useCallback } from 'react';
import { useSettings } from '../data/repos';
import type { Gender } from '../domain/types';
import { t, type StringKey, type Vars } from './he';

/** Translation function bound to the user's chosen form of address. */
export function useT(): { t: (key: StringKey, vars?: Vars) => string; gender: Gender } {
  const gender = useSettings()?.gender ?? 'm';
  const bound = useCallback((key: StringKey, vars?: Vars) => t(key, gender, vars), [gender]);
  return { t: bound, gender };
}
