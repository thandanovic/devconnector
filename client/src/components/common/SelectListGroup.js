import React from 'react';
import classnames from 'classnames'
import PropTypes from 'prop-types'


const SelectListGroup = ({
    name, info, error, onChange,value, options
}) => {
    const selectOptions = options.map(option => {
        <option key={option.label} value={option.value}>
            {option.value}
        </option>
     })
    return (
        <div className="form-group">
            <select  value={value} onChange={onChange} className={classnames("form-control form-control-lg", {
                'is-invalid': error
            })} placeholder={placeholder} name={name} value={value} >
                {selectOptions}
            </select>
            {info && <small className='form-text text-muted'>{info}</small>}
            {error && (<div className='invalid-feedback'>{error}</div>)}
        </div>
    )
}

TextAreaFieldGroup.propTypes={
    name: PropTypes.string.isRequired,
    value: PropTypes.string, 
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    info: PropTypes.string,
    options: PropTypes.array.isRequired
}


export default TextAreaFieldGroup;