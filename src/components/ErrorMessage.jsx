import React from 'react';

const ErrorMessage = (props) => {
    return (
       <div className="err-msg">
           {props.errState.name}: {props.errState.message}
       </div>
    )
}

export default ErrorMessage;