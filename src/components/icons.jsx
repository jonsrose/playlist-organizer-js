export const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M20,90 L80,50 L20,10 Z" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/> 
  </svg>
);

export const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <rect x="20" y="10" width="20" height="80" fill="grey" stroke="grey" strokeWidth="10" rx="10" ry="10"/>
    <rect x="60" y="10" width="20" height="80" fill="grey" stroke="grey" strokeWidth="10" rx="10" ry="10"/>
  </svg>
);

export const PlayingIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect fill="green" x="10" y="20" width="10" height="60">
      <animate attributeName="height" values="60;20;60" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" values="40;80;40" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect fill="green" x="30" y="10" width="10" height="80">
      <animate attributeName="height" values="80;40;80" dur="0.8s" repeatCount="indefinite" />
      <animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite" />
    </rect>
    <rect fill="green" x="50" y="5" width="10" height="90">
      <animate attributeName="height" values="90;30;90" dur="0.9s" repeatCount="indefinite" />
      <animate attributeName="y" values="10;70;10" dur="0.9s" repeatCount="indefinite" />
    </rect>
    <rect fill="green" x="70" y="10" width="10" height="80">
      <animate attributeName="height" values="80;60;80" dur="1s" repeatCount="indefinite" />
      <animate attributeName="y" values="20;40;20" dur="1s" repeatCount="indefinite" />
    </rect>
    <rect fill="green" x="90" y="20" width="10" height="60">
      <animate attributeName="height" values="60;80;60" dur="1.1s" repeatCount="indefinite" />
      <animate attributeName="y" values="40;20;40" dur="1.1s" repeatCount="indefinite" />
    </rect>
  </svg>
)

export const PlayNextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <polygon points="20,10 60,50 20,90" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
    <rect x="70" y="10" width="20" height="80" fill="grey" stroke="grey" strokeWidth="10" rx="10" ry="10"/>
  </svg>
);

export const PlayPreviousIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <polygon points="80,10 40,50 80,90" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
    <rect x="10" y="10" width="20" height="80" fill="grey" stroke="grey" strokeWidth="10" rx="10" ry="10"/>
  </svg>
);


export const VolumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M20,40 L40,40 L60,20 L60,80 L40,60 L20,60 Z" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
    <rect x="70" y="30" width="10" height="40" fill="grey" stroke="grey" strokeWidth="10" rx="5" ry="5"/>
  </svg>
);

// export const MutedIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
//     <path d="M20,40 L40,40 L60,20 L60,80 L40,60 L20,60 Z" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
//     <path d="M70,30 L80,40 L80,60 L70,70" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
//   </svg>
// );

export const MutedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M20,40 L40,40 L60,20 L60,80 L40,60 L20,60 Z" fill="grey" stroke="grey" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round"/>
    <rect x="70" y="30" width="10" height="40" fill="grey" stroke="grey" strokeWidth="10" rx="5" ry="5"/>
    <line x1="30" y1="30" x2="70" y2="70" stroke="black" strokeWidth="8" strokeLinecap="round" />
    <line x1="70" y1="30" x2="30" y2="70" stroke= "black" strokeWidth="8" strokeLinecap="round" />
  </svg>
);