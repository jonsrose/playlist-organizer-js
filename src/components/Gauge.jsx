import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

const Gauge = ({ radius, value, className }) => {
  const strokeWidth = radius * 0.2;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const arcLength = circumference * value; // Calculate the length of the arc

  // Generate a unique ID for the gradient
  const gradientId = useMemo(() => uuidv4(), []);

  return (
    <div className={className}>
      <svg height={radius * 2} width={radius * 2}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="red" />
            <stop offset="50%" stopColor="yellow" />
            <stop offset="100%" stopColor="green" />
          </linearGradient>
        </defs>
        {/* Base circle */}
        <circle
          className="gauge_base"
          cx={radius}
          cy={radius}
          fill="transparent"
          r={innerRadius}
          stroke="black"
          strokeWidth={strokeWidth}
        />
        {/* Arc representing energy level */}
        <circle
          className="gauge_arc"
          cx={radius}
          cy={radius}
          fill="transparent"
          r={innerRadius}
          stroke={`url(#${gradientId})`} // Use gradient for stroke color
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength}, ${circumference}`}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
    </div>
  );
};

Gauge.propTypes = {
  radius: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default Gauge;