import './Spinner.css'

const Spinner = () => (
    <svg
        className="spinner"
        viewBox="0 0 50 50"
        width="16"
        height="16"
    >
        <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
        />
    </svg>
);

export default Spinner