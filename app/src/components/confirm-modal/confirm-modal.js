import React from "react";


const ConfirmModal = ({modal, target, method, text})=>{
    const {title, descr, btn} = text;
    return (
        <div id={target} uk-modal={modal.toString()} container="false">
            <div className="uk-modal-dialog">
                
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">{title}</h2>
                </div>
                <div className="uk-modal-body">
                    <p>{descr}</p>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Cancel</button>
                    <button 
                        className="uk-button uk-button-primary uk-modal-close" 
                        type="button"
                        onClick={()=> method()}>{btn}</button>
                </div>
            </div>
        </div>
    )
};

export default ConfirmModal;