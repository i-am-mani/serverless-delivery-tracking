import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function HistoryBackButton() {
  const onBackClick = () => {
    window.history.back();
  };
  return (
    <button onClick={onBackClick} className="transform hover:scale-95">
      <FontAwesomeIcon
        icon={faArrowAltCircleLeft}
        size="2x"
        className="rounded-full shadow-md text-lime-500"
      />
    </button>
  );
}

export default HistoryBackButton;
