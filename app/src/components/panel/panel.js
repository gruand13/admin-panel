import React from 'react';

const Panel = ()=>{
    return (
        <div className="panel">
            <button className="uk-button uk-button-primary uk-margin-small-right" uk-toggle="target: #modal-open">Open</button>
            <button className="uk-button uk-button-primary" uk-toggle="target: #modal-save">Publish</button>
            <button className="uk-button uk-button-dafault" uk-toggle="target: #modal-backup">Backup</button>

        </div>
    )
};

export default Panel;