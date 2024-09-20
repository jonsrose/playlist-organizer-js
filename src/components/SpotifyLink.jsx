const SpotifyLink = ({ children, href, className='' }) => (
  <a href={href} target="_blank" className={`hover:underline ${className}`} onClick={e => e.stopPropagation()}>
    {children}
  </a>
);

export default SpotifyLink;

