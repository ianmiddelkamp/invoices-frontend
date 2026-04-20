import { DateTime, Duration } from 'luxon';
import { TimeEntry } from '../types';

export const today = (): string => DateTime.now().toISODate() ?? '';

export const firstOfMonth = (): string => DateTime.now().startOf('month').toISODate() ?? '';

export const formatDate = (str: string | null): string =>
  str ? DateTime.fromISO(str).toLocal().toFormat('MMM d, yyyy') : '—';

export const formatDateTime = (str: string | null): string =>
  str ? DateTime.fromISO(str).toLocal().toFormat('MMM d, yyyy HH:mm') : '—';

export const elapsedSeconds = (startedAt: string): number =>
  Math.floor(DateTime.now().diff(DateTime.fromISO(startedAt), 'seconds').seconds);

export const formatElapsed = (seconds: number): string =>
  Duration.fromObject({ seconds }).toFormat('hh:mm:ss');

export const hoursFromRange = (startedAt: string, stoppedAt: string): number =>
  parseFloat(
    DateTime.fromISO(stoppedAt).diff(DateTime.fromISO(startedAt), 'hours').hours.toFixed(2)
  );
export const compareStartedAt = (a: TimeEntry, b: TimeEntry) => {
  const t1 = a.started_at ? DateTime.fromISO(a.started_at).toMillis() : 0
  const t2 = b.started_at ? DateTime.fromISO(b.started_at).toMillis() : 0
  if (t1 < t2) {
    return -1;
  } else if (t1 > t2) {
    return 1;
  }
  return 0
}