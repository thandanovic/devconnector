import React from 'react';
import classnames from 'classnames'
import PropTypes from 'prop-types'


const TextFieldGroup = ({
    name, placeholder, type, info, error, onChange,value, label, disabled, email
}) => {
    return (
        <div className="form-group">
            <input type={type} value={value} onChange={onChange} className={classnames("form-control form-control-lg", {
                'is-invalid': error
            })} placeholder={placeholder} name={name} value={value} disabled={disabled} />
            {info && <small className='form-text text-muted'>{info}</small>}
            {error && (<div className='invalid-feedback'>{error}</div>)}
        </div>
    )
}

TextFieldGroup.propTypes={
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired, 
    value: PropTypes.string, 
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    info: PropTypes.string,
    disabled: PropTypes.string

}

TextFieldGroup.defaultProps={
    type: 'text'
}

export default TextFieldGroup;