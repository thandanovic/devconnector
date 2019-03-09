import React from 'react';
import classnames from 'classnames'
import PropTypes from 'prop-types'

const InputGroup = ({
    name, placeholder, type, info, error, onChange, value, label, disabled, email
}) => {
    return (
        <div>
            <div className="input-group mb3">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <i className="icon"></i>
                    </span>
                </div>
            </div>
            <div className="form-group">
                <input value={value} onChange={onChange} className={classnames("form-control form-control-lg", {
                    'is-invalid': error
                })} placeholder={placeholder} name={name} value={value} />
                {error && (<div className='invalid-feedback'>{error}</div>)}
            </div>
        </div>
    );
}

InputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    icon: PropTypes.string
}

InputGroup.defaultProps = {
    type: "text"
}


export default InputGroup;