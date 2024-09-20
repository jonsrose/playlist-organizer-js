import PropTypes from 'prop-types';

const SpotifyLink = ({ children, href, className='' }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`hover:underline ${className}`} onClick={e => e.stopPropagation()}>
    {children}
  </a>
);

SpotifyLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SpotifyLink;

