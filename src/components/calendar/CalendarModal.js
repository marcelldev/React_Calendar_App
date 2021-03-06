import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { useSelector, useDispatch } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/eventsCalendar';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
Modal.setAppElement('#root')

const now = moment().minutes(0).seconds(0).add(1,'hours');
const nowPlus1 = now.clone().add(1,'hours');

const initEvent = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: nowPlus1.toDate()

}

export const CalendarModal = () => {

  const [dateStart, setdateStart] = useState(now.toDate());
  const [dateEnd, setdateEnd] = useState(nowPlus1.toDate());
  const [titleValid, setTitleValid] = useState(true);
  
  const {modalOpen} = useSelector(state => state.ui);
  const {activeEvent} = useSelector(state => state.calendar);

  const dispatch = useDispatch();


   const [formValues, setformValues] = useState(initEvent);

   const {notes, title,start,end} = formValues;

   useEffect(() => {
       
       if (activeEvent) {
         setformValues(activeEvent)
       }else{
         setformValues(initEvent);
       }

   }, [activeEvent,setformValues])
  
    const closeModal=()=>{

      dispatch(uiCloseModal());
      dispatch(eventClearActiveEvent());
      setformValues(initEvent);

    }

    const handleStartDateChange =(e)=>{

      setdateStart(e);
      setformValues({
        ...formValues,
        start:e
      });

    }

    const handleEndDateChange = (e)=>{
      
      setdateEnd(e);
      setformValues({
        ...formValues,
        end:e
      });

    }
    
    const handleInputChange=({target}) =>{

      setformValues({
        ...formValues,
        [target.name]:target.value
      })
    }

    const handleSubmitForm = (e) =>{

          e.preventDefault();
          /* console.log(formValues);
          console.log('Titulo : ',formValues.title); */

          const momentStart = moment(start);
          const momentEnd = moment(end);

          if (momentStart.isSameOrAfter(momentEnd)) {//si la fecha es ingual o esta despues de fecha final error
            return Swal.fire('Error','fecha final debe de ser mayor','error');
            
          }

          if (title.trim().length < 2) {
            
            return setTitleValid(false)
            
          }

          if (activeEvent) {

            dispatch(eventStartUpdate(formValues))
            
          } else {
          // TODO: realizar grabacion en db
          
          dispatch(eventStartAddNew(
              formValues              
            ));
          }
          setTitleValid(true);
          closeModal();

    }

    return (
        <Modal
          isOpen={modalOpen}
        /*   onAfterOpen={afterOpenModal}*/
          onRequestClose={closeModal} 
          style={customStyles}
          closeTimeoutMS={200}
          className="modal"
          overlayClassName="modal-fondo"
          >
            <h1> {(activeEvent) ? 'Editando evento' : 'Creando Nuevo'} </h1>
            <hr />
            <form className="container"
                  onSubmit={handleSubmitForm}
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                      onChange={handleStartDateChange}
                      value={dateStart}
                      className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                      onChange={handleEndDateChange}
                      value={dateEnd}
                      minDate={dateStart}
                      className="form-control"
                    />
                </div>

                <hr /> 
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control ${!titleValid && 'is-invalid' }`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
