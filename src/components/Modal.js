import React, {useEffect, useRef} from 'react'; 
import './Modal.css';
import pattern from '../images/star2.jpeg';

export default function Modal({ children, shown, close, message }) {
    return shown ? (
      <div className="modal-backdrop" onClick={() => { close(); }}>
        <div className="modal-content" onClick={e => { e.stopPropagation(); }} style={{ backgroundImage: `url(${pattern})` }} >
          <div className="modal__text">
            <div>
              {message} 
            </div>
          </div>
          <button onClick={close}>OK</button>
        </div>
      </div>
    ) : null;
  }
