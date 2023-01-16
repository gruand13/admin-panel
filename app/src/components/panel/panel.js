import React from 'react';

const Panel = ()=>{
    return (
        <div className="panel">
            <button className="uk-button uk-button-primary uk-margin-small-right" uk-toggle="target: #modal-open">Open</button>
            <button className="uk-button uk-button-primary uk-margin-small-right" uk-toggle="target: #modal-save">Publish</button>
            <button className="uk-button uk-button-primary uk-margin-small-right" uk-toggle="target: #modal-meta">Edit Meta</button>
            <button className="uk-button uk-button-dafault uk-margin-small-right" uk-toggle="target: #modal-backup">Backup</button>
            <button className="uk-button uk-button-danger " uk-toggle="target: #modal-logout">Exit</button>


        </div>
    )
};

export default Panel;