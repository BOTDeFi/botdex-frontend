import React from 'react';
import Button from '../../button';
import './style.scss';

const Input = ({ placeholder = "",
    setFunction = () => {},
    blur = () => {},
    value, btn = null,
    isNumberReading = false,
    isValid = true,
    disabled = false, specialClass = "" }) => {
    const [isTouched, setTouched] = React.useState(false);
    const [valueForView, setValueForView] = React.useState('');
    React.useEffect(() => {
        if (value === '') {
            setTouched(false);
        }
        if (isNumberReading) {
            let val = value.replace(/^0(?!\.)/g, '')
                .replace(/[^0-9.,]/g, '')
                .replace(/,/, '.')
                .replace(/^(\d+(?:\.\d{0,20})?|\.\d{0})?.*?$/, "$1")
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ").split('.');
            if (val[1]) {
                val[1] = val[1].replace(/ /g, '');
                val = val.join('.');
            }
            setValueForView(val);
        } else {
            setValueForView(value);
        }
    }, [value]);
    return (
        <div className={`input__wrapper ${specialClass}`}>
            <input className={`input${isValid || !isTouched ? "" : " input__invalid"}`}
                placeholder={placeholder}
                value={valueForView}
                onFocus={() => setTouched(true)}
                onChange={e => { setFunction(e.target.value.replace(/ /g, '')); }}
                onBlur={blur}
                disabled={disabled}
            />
            {(btn ? <Button text={btn.text}
                specialClass={btn.specialClass}
                arrow={btn.arrow}
                clickFunc={btn.clickFunc}
                disabled={btn.disabled}
            /> : null) }
        </div>
    );
};
export default Input;
