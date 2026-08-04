import Icon from './Icon';

function PlayerButton({ icon, onClick, className = '', active = false }) {
  const iconMap = {
    play: <Icon name="play" />,
    pause: <Icon name="pause" />,
    volume: <Icon name="volume" />,
    mute: <Icon name="mute" />,
    fullscreen: <Icon name="fullscreen" />,
    subtitle: <Icon name="subtitle" />,
    speed: <Icon name="speed" />,
    next: <Icon name="next" />,
    episodes: <Icon name="episodes" />,
    'skip-back': <Icon name="skipBack" />,
    'skip-forward': <Icon name="skipForward" />,
    close: <Icon name="close" />
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        text-white opacity-80 hover:opacity-100
        transition-opacity duration-200
        ${active ? 'opacity-100' : ''}
        ${className}
      `}
    >
      {iconMap[icon] || null}
    </button>
  );
}

export default PlayerButton;
