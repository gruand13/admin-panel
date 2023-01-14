import React from "react";
import UIkit from "uikit";

const ConfirmModal = ({modal, target, method})=>{
    return (
        <div id={target} uk-modal={modal.toString()} container="false">
            <div className="uk-modal-dialog">
                
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">saving...</h2>
                </div>
                <div className="uk-modal-body">
                    <p>Do you really want to save changes?</p>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Cancel</button>
                    <button 
                        className="uk-button uk-button-primary uk-modal-close" 
                        type="button"
                        onClick={()=> method(()=>{
                            UIkit.notification({message: 'Successfully saved', status: "success" })
                        },
                        ()=>{
                            UIkit.notification({message: 'Error with saving', status: "danger" })
                        }
                        )}>Publish</button>
                </div>
            </div>
        </div>
    )
};

export default ConfirmModal;