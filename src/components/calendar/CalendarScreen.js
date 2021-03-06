import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'


import { Navbar } from '../ui/Navbar'
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { eventSetActive, eventClearActiveEvent, eventStartLoading } from '../../actions/eventsCalendar';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');

const localizer = momentLocalizer(moment);
/* const _events = [{
    title:'Cumpleños del Jefe',
    start:moment().toDate(),
    end: moment().add(2,'hours').to Date(),
    bgcolor:'#fafafa',
    notes:'Comprar el Pastel',
    user:{
        _id:'123',
        name:'Fernando'
    }
    } 
] */

export const CalendarScreen = () => {

    const [lastView, setlastView] = useState(localStorage.getItem('lastView : ')|| 'month');
    
    
     const dispatch = useDispatch();

     const {events,activeEvent} = useSelector(state => state.calendar)
     const { uid } = useSelector( state => state.auth );

     useEffect(() => {
         
        dispatch(eventStartLoading());

     }, [dispatch])

    //give double click in the note
    const onDoubleClick =(e) =>{
        //console.log(e);
        dispatch(uiOpenModal());
        dispatch(uiOpenModal());

    }

    //give select in the note
    const onSelectEvent =(e) =>{

        dispatch(eventSetActive(e));
        
    } 
    
    //view change in the note
    const onViewChange =(e) =>{
        setlastView(e);
        localStorage.setItem('lastView : ', e);
    } 

    const onSelectSlot =(e)=>{
       
        dispatch(eventClearActiveEvent());
    }

    const eneventStyleGetter =(event,start,end,isSelect)=>{
       
        //console.log(event,start,end,isSelect);
        //console.log(event);

        const style={
            backgroundColor: ( uid === event.user._id ) ? '#367CF7' : '#465660',
            borderRadius:'0px',
            opacity:0.8,
            display:'block',
            color:'white'
        }

        return {
            style 
        }
    };

    return (
         <div className="calendar-screem">
             <Navbar/>

             <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                messages={messages}
                eventPropGetter={eneventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
                components={{
                    event:CalendarEvent
                }}
                />

                <AddNewFab/>
                
                {

                 (activeEvent) && <DeleteEventFab/> 

                }


                <CalendarModal/>
        </div>
        )
}
