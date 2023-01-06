import s from "/sass/claim/claim.module.css";
import Enums from "enums";

export default function PinkLargeButton({ text = "", onClick }) {
    return (
        <button className={s.pinkBtn} onClick={onClick}>
            <img
                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                alt="connectToContinue"
            />
            <div>
                <span>{text}</span>
            </div>
        </button>
    );
}
