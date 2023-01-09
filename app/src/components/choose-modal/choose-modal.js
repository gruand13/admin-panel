import React from "react";

const ChooseModal = ({modal, target, data, redirect})=>{
    const list= data.map(item=>{
        if(item.time){
            return (
                <li key={item.file}>
                    <a 
                    className="uk-link-muted uk-modal-close" 
                    href='#'
                    onClick={(e) => redirect(e, item.file)}>Backup copy: {item.time}</a>
                </li>
            )
        } else {
            return (
                <li key={item}>
                    <a 
                    className="uk-link-muted uk-modal-close" 
                    href='#'
                    onClick={(e) => redirect(e, item)}>{item}</a>
                </li>
            )
        }
        
    });
    let msg;
    if(data.length <1){
        msg = <div>Backup copy does not found</div>
    }

    return (
        <div id={target} uk-modal={modal.toString()} container="false">
            <div className="uk-modal-dialog">
                
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">OPEN</h2>
                    {msg};
                </div>
                <div className="uk-modal-body">
                    <ul className="uk-list uk-list-divider">
                        {list}
                    </ul>
                </div>
                
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                    
                </div>
            </div>
        </div>
    )
};

export default ChooseModal;