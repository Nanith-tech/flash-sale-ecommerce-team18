import { useEffect, useState } from 'react';
import { Clock } from '@phosphor-icons/react';
import { remainingTime } from '../../utils/format';
export default function CountdownTimer({ catalog, onExpired }) {
  const [now, setNow] = useState(() => performance.now());
  useEffect(() => {
    const id = setInterval(() => setNow(performance.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const upcoming =
    catalog.sale.status === 'UPCOMING' &&
    catalog.serverTimestamp + now - catalog.synchronizedAt <
      new Date(catalog.sale.startsAt).getTime();
  const time = remainingTime(
    upcoming ? catalog.sale.startsAt : catalog.sale.endsAt,
    catalog.serverTimestamp,
    Math.max(0, now - catalog.synchronizedAt),
  );
  const expired = !upcoming && time.total === 0;
  useEffect(() => {
    onExpired(expired || upcoming);
  }, [expired, upcoming, onExpired]);
  return (
    <div className="countdown-wrap">
      <div className="countdown-copy">
        <Clock size={22} />
        <div>
          <strong>
            {expired
              ? 'This drop has ended'
              : upcoming
                ? 'Something good is coming'
                : 'Good things don’t wait.'}
          </strong>
          <span>
            {expired
              ? 'Thanks for being part of it. Watch this space.'
              : upcoming
                ? 'The next drop opens in'
                : 'This drop ends in'}
          </span>
        </div>
      </div>
      <div
        className={`countdown ${expired ? 'is-expired' : ''}`}
        role="timer"
        aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds ${upcoming ? 'until sale starts' : 'remaining'}`}
      >
        {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => (
          <div className="timer-unit" key={unit}>
            {index > 0 && (
              <span className="timer-colon" aria-hidden="true">
                :
              </span>
            )}
            <strong>{String(time[unit]).padStart(2, '0')}</strong>
            <span>{unit}</span>
          </div>
        ))}
      </div>
      <p className="countdown-note">
        Limited quantities.
        <br />
        When it’s gone, it’s gone.
      </p>
    </div>
  );
}
